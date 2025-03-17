// Brazilian Secondary Vegetation Mapping v7
// ******************************************************************************************
//  * Institution:  National Institute for Space Research (INPE) / Amazon Environmental Research Institute (IPAM)
//  * Funder:       National Council for Scientific and Technological Development - CNPq (Process CNPq 401741/2023-0)
//  * Purpose:      Map the increment, extent, age, and loss of secondary growth vegetation in Brazil
//  * Author:       Celso H. L. Silva-Junior
//  * Email:        celsohlsj@gmail.com
// ******************************************************************************************

// Configuration Variables
var firstYear = 1985; // The first year of the data series
var lastYear = 2023;  // The last year of the data series
var totalYears = lastYear - firstYear + 1;
var mapbiomasCollection = 'collection9';  // MapBiomas data collection version
var mappingVersion = 'v71';  // Version of the mapping process
var assetFolder = 'users/ybyrabr/public';  // Destination folder for exported assets
var brazil = ee.FeatureCollection("users/celsohlsj/brazil"); // Brazil's delimitation

// 0. MapBiomas Data (Collection 9)
// Legend for MapBiomas: https://brasil.mapbiomas.org/wp-content/uploads/sites/4/2024/08/Legenda-Colecao-9-LEGEND-CODE.pdf
var mapbiomas = ee.Image('projects/mapbiomas-public/assets/brazil/lulc/collection9/mapbiomas_collection90_integration_v1');

// Oil Palm Extent from Descals et al. (2024; https://doi.org/10.5194/essd-16-5111-2024) 
var OilPalmExtent = ee.ImageCollection('projects/ee-globaloilpalm/assets/shared/GlobalOilPalm_extent_2021')
		.mosaic()
		.unmask(0)
		.eq(0)
		.clip(brazil);

// 1. Reclassifying MapBiomas Data #Step 1
var empty = ee.Image().byte();
for (var i = 0; i < totalYears; i++)  {
    var y = firstYear + i;
    var year = 'classification_' + y;
    var forest = mapbiomas.select(year);
    forest = forest.remap([3, 4, 5, 6, 49, 11, 12, 32, 50], [1, 1, 1, 1, 1, 1, 1, 1, 1], 0); // All natural vegetation classes from MapBiomas
    forest = forest.multiply(OilPalmExtent); // Excluding Oil Palm areas
    empty = empty.addBands(forest.rename(ee.String(year)));
}
var mapbiomas_forest = empty.select(empty.bandNames().slice(1));

// 1.1 Anthropic Mask
var empty = ee.Image().byte();
for (var i = 0; i < totalYears; i++)  {
    var y = firstYear + i;
    var year = 'classification_' + y;
    var anthropic = mapbiomas.select(year).remap([15, 19, 39, 20, 40, 62, 41, 46, 47, 35, 48, 9, 21], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 0).rename(ee.String(year));
    empty = empty.addBands(anthropic);
}
var anthropic_mask = empty.select(empty.bandNames().slice(1));

// 2. Mapping the Annual Increment of Secondary Forests  #Step 2
var empty = ee.Image().byte();
for (var i = 0; i < totalYears - 1; i++)  {
    var y1 = firstYear + i;
    var y2 = firstYear + 1 + i;
    var year1 = 'classification_' + y1;
    var year2 = 'classification_' + y2;
    var a_mask = anthropic_mask.select(year1);
    var forest1 = mapbiomas_forest.select(year1).remap([0, 1], [0, 2]);
    var forest2 = mapbiomas_forest.select(year2);
    var sforest = forest1.add(forest2);
    sforest = sforest.remap([0, 1, 2, 3], [0, 1, 0, 0]).multiply(a_mask).rename(ee.String(year2));
    empty = empty.addBands(sforest);
}
var sforest_all = empty.select(empty.bandNames().slice(1));

// 3. Mapping the Annual Extent of Secondary Forests  #Step 3
var empty = ee.Image().byte();
var ext = sforest_all.select('classification_1986');
ext = ext.rename(ee.String('classification_1986'));
empty = empty.addBands(ext);
for (var i = 1; i < totalYears - 1; i++)  {
    var y = firstYear + 1 + i;
    var y2 = firstYear + i;
    var year = 'classification_' + y;
    var year2 = 'classification_' + y2;
    var sforest = sforest_all.select(year);
    var acm_forest = empty.select(year2).add(sforest);
    var remap = acm_forest.neq(0);
    empty = empty.addBands(remap.multiply(mapbiomas_forest.select(year)).rename(ee.String(year)));
}
var sforest_ext = empty.select(empty.bandNames().slice(1));

// 3.1 Secondary Forest Loss
var empty = ee.Image().byte();
var empty2 = ee.Image().byte();
var ext = sforest_all.select('classification_1986');
ext = ext.rename(ee.String('classification_1986'));
empty = empty.addBands(ext);
for (var i = 1; i < totalYears - 1; i++)  {
    var y = firstYear + 1 + i;
    var y2 = firstYear + i;
    var year = 'classification_' + y;
    var year2 = 'classification_' + y2;
    var sforest = sforest_all.select(year);
    var acm_forest = empty.select(year2).add(sforest);  
	var remap = acm_forest.neq(0);
    var mask = mapbiomas_forest.select(year).remap([0, 1], [500, 1]);
    var loss = remap.add(mask).remap([1, 2, 500, 501], [0, 0, 0, 1]);
    empty2 = empty2.addBands(loss.rename(ee.String(year)));
    empty = empty.addBands(remap.multiply(mapbiomas_forest.select(year)).rename(ee.String(year)));
}
var sforest_loss = empty2.select(empty2.bandNames().slice(1));

// 4. Calculating and Mapping the Age of Secondary Forests  #Step 4
var empty = ee.Image().byte();
var age = sforest_ext.select('classification_1986');
age = age.rename(ee.String('classification_1986'));
empty = empty.addBands(age);
empty = empty.slice(1);
var temp = empty;
for (var i = 1; i < totalYears - 1; i++)  {
    var y = firstYear + 1 + i;
    var year = 'classification_' + y;
    var sforest = sforest_ext.select(year);
    var ageforest = empty.add(sforest);
    var fYear = mapbiomas_forest.select(year);
    ageforest = ageforest.multiply(fYear);
    temp = temp.addBands(ageforest.rename(ee.String(year)));
    var empty = ageforest;
}
var sforest_age = temp;

// Export Products Data to Asset
Export.image.toAsset({
    image: sforest_all,
    description: 'secondary_vegetation_increment_'  + mapbiomasCollection + '_' + mappingVersion,
    assetId: assetFolder + '/secondary_vegetation_increment_' + mapbiomasCollection + '_' + mappingVersion,
    scale: 30,
    region: brazil,
    maxPixels: 1e13
});

Export.image.toAsset({
    image: sforest_ext,
    description: 'secondary_vegetation_extent_' + mapbiomasCollection + '_' + mappingVersion,
    assetId: assetFolder + '/secondary_vegetation_extent_' + mapbiomasCollection + '_' + mappingVersion,
    scale: 30,
    region: brazil,
    maxPixels: 1e13
});

Export.image.toAsset({
    image: sforest_age,
    description: 'secondary_vegetation_age_' + mapbiomasCollection + '_' + mappingVersion,
    assetId: assetFolder + '/secondary_vegetation_age_' + mapbiomasCollection + '_' + mappingVersion,
    scale: 30,
    region: brazil,
    maxPixels: 1e13
});

Export.image.toAsset({
    image: sforest_loss,
    description: 'secondary_vegetation_loss_' + mapbiomasCollection + '_' + mappingVersion,
    assetId: assetFolder + '/secondary_vegetation_loss_' + mapbiomasCollection + '_' + mappingVersion,
    scale: 30,
    region: brazil,
    maxPixels: 1e13
});
