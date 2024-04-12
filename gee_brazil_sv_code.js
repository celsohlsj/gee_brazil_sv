// Brazilian Secondary Vegetation Mapping using Google Earth Engine
// Institution: National Institute for Space Research (INPE)
// Purpose: Map the increment, extent, age, and loss of secondary growth vegetation in Brazil
// Author: Celso H. L. Silva-Junior

// Configuration Variables
var firstYear = 1985; // The first year of the data series
var lastYear = 2022;  // The last year of the data series
var mapbiomasCollection = 'collection8';  // MapBiomas data collection version
var mappingVersion = 'v61';  // Version of the mapping process
var assetFolder = 'users/ybyrabr/public';  // Destination folder for exported assets

// Importing MapBiomas data for Brazil
var brazil = ee.FeatureCollection("users/celsohlsj/brazil");
var mapbiomas = ee.Image('projects/mapbiomas-workspace/public/collection8/mapbiomas_collection80_integration_v1');

// Define the total number of years to process
var totalYears = lastYear - firstYear + 1;

// Function to reclassify MapBiomas data to identify natural vegetation
function reclassifyMapbiomas(sourceImage, classValues, years) {
    var empty = ee.Image().byte();
    for (var i = 0; i < years; i++) {
        var year = firstYear + i;
        var classification = 'classification_' + year;
        var forest = sourceImage.select(classification).remap(classValues, classValues.map(function() { return 1; }), 0);
        empty = empty.addBands(forest.rename(classification));
    }
    return empty.select(empty.bandNames().slice(1));
}

// Function to create masks for anthropic areas and water bodies
function createMask(sourceImage, classValues, years) {
    var mask = ee.Image().byte();
    for (var i = 0; i < years; i++) {
        var year = firstYear + i;
        var classification = 'classification_' + year;
        var masked = sourceImage.select(classification).remap(classValues, classValues.map(function() { return 1; }), 0);
        mask = mask.addBands(masked.rename(classification));
    }
    return mask.select(mask.bandNames().slice(1));
}

// Function to map annual increment of secondary vegetation
function mapIncrement(forestLayer, anthropicLayer, waterLayer, years) {
    var increment = ee.Image().byte();
    for (var i = 0; i < years - 1; i++) {
        var year1 = firstYear + i;
        var year2 = firstYear + i + 1;
        var incrementLayer = forestLayer.select('classification_' + year1)
                                        .add(forestLayer.select('classification_' + year2))
                                        .remap([0, 1, 2, 3], [0, 1, 0, 0])
                                        .multiply(anthropicLayer.select('classification_' + year1))
                                        .multiply(waterLayer)
                                        .rename('classification_' + year2);
        increment = increment.addBands(incrementLayer);
    }
    return increment.select(increment.bandNames().slice(1));
}

// Function to map annual extent and loss of secondary vegetation
function mapExtentAndLoss(incrementLayer, forestLayer, years) {
    var extent = ee.Image().byte();
    var loss = ee.Image().byte();
    for (var i = 0; i < years - 1; i++) {
        var year = firstYear + i + 1;
        var extentLayer = incrementLayer.select('classification_' + year).rename('classification_' + year);
        var lossLayer = extentLayer.subtract(forestLayer.select('classification_' + year)).remap([-1, 0, 1], [1, 0, 0]);
        extent = extent.addBands(extentLayer);
        loss = loss.addBands(lossLayer);
    }
    return { sforest_ext: extent.select(extent.bandNames().slice(1)), sforest_loss: loss.select(loss.bandNames().slice(1)) };
}

// Function to calculate and map the age of secondary vegetation
function mapAge(extentLayer, years) {
    var age = ee.Image().byte();
    for (var i = 0; i < years - 1; i++) {
        var year = firstYear + i + 1;
        var ageLayer = extentLayer.select('classification_' + year).rename('classification_' + year);
        age = age.addBands(ageLayer);
    }
    return age.select(age.bandNames().slice(1));
}

// Reclassify MapBiomas data to identify natural vegetation
// MapBiomas Legend Codes: https://brasil.mapbiomas.org/wp-content/uploads/sites/4/2023/08/Legenda-Colecao-8-LEGEND-CODE.pdf
// MapBiomas Legend Description: https://brasil.mapbiomas.org/wp-content/uploads/sites/4/2023/09/Legenda-Colecao-8-Descricao-Detalhada-PDF-PT-3-1.pdf
var naturalVegetationClasses = [1, 2, 3, 4, 5, 6, 49, 11, 12, 32, 50, 13];
var mapbiomas_forest = reclassifyMapbiomas(mapbiomas, naturalVegetationClasses, totalYears);

// Create masks for anthropic areas and water bodies
var anthropicClasses = [15, 19, 39, 20, 40, 62, 41, 46, 47, 35, 48, 9, 21];
var anthropic_mask = createMask(mapbiomas, anthropicClasses, totalYears);
var water_mask = ee.Image("JRC/GSW1_4/GlobalSurfaceWater").select("max_extent").clip(brazil).remap([0, 1], [1, 0]);

// Map annual increment of secondary vegetation
var sforest_all = mapIncrement(mapbiomas_forest, anthropic_mask, water_mask, totalYears);

// Map annual extent and loss of secondary vegetation
var extentAndLossResults = mapExtentAndLoss(sforest_all, mapbiomas_forest, totalYears);
var sforest_ext = extentAndLossResults.sforest_ext;
var sforest_loss = extentAndLossResults.sforest_loss;

// Calculate and map the age of secondary vegetation
var sforest_age = mapAge(sforest_ext, totalYears);

// Function to export images to the specified Google Earth Engine asset folder
function exportToGEE(image, description, assetIdSuffix) {
    var assetId = assetFolder + '/' + assetIdSuffix + '_' + mapbiomasCollection + '_' + mappingVersion;
    Export.image.toAsset({
        image: image,
        description: description + '_' + mapbiomasCollection + "_" + mappingVersion,
        assetId: assetId,
        scale: 30,
        region: brazil,
        maxPixels: 1e13
    });
}

// Exporting the processed data to Google Earth Engine assets
exportToGEE(sforest_all, 'secondary_vegetation_increment', 'secondary_vegetation_increment');
exportToGEE(sforest_ext, 'secondary_vegetation_extent', 'secondary_vegetation_extent');
exportToGEE(sforest_age, 'secondary_vegetation_age', 'secondary_vegetation_age');
exportToGEE(sforest_loss, 'secondary_vegetation_loss', 'secondary_vegetation_loss');
