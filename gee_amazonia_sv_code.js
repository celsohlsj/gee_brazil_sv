// Amazonia Secondary Vegetation Mapping v3
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
var mapbiomasCollection = 'collection6';  // MapBiomas data collection version
var mappingVersion = 'v3';  // Version of the mapping process
var assetFolder = 'users/ybyrabr/public';  // Destination folder for exported assets

// 0. MapBiomas Data (Collection 6)
// Legend for MapBiomas: https://amazonia.mapbiomas.org/wp-content/uploads/sites/10/2025/01/Leyenda_Coleccion6.pdf
var mapbiomas = ee.Image('projects/mapbiomas-public/assets/amazon/lulc/collection6/mapbiomas_collection60_integration_v1');
var aoi = mapbiomas.geometry().bounds(); // Amazonia delimitation

// Oil Palm Extent from Descals et al. (2024; https://doi.org/10.5194/essd-16-5111-2024) 
var OilPalmExtent = ee.ImageCollection('projects/ee-globaloilpalm/assets/shared/GlobalOilPalm_extent_2021')
		.mosaic()
		.unmask(0)
		.eq(0)
		.clip(aoi);
		
// Water Extent Mask from MapBiomas
var WaterExtent = mapbiomas
                  .remap([33, 34], [1, 1], 0) // River, lake and ocean = 33; Glacier = 34
                  .reduce(ee.Reducer.sum())
                  .eq(0);

// 1. Reclassifying MapBiomas Data #Step 1
var empty = ee.Image().byte();
for (var i = 0; i < totalYears; i++)  {
    var y = firstYear + i;
    var year = 'classification_' + y;
    var forest = mapbiomas.select(year);
    forest = forest.remap([3, 6], [1, 1], 0); // Forest Formation classes from MapBiomas Brazil
    //forest = forest.remap([3, 4, 5, 6, 11, 12, 13], [1, 1, 1, 1, 1, 1, 1], 0); // All natural vegetation classes from MapBiomas Amazonia
    forest = forest.multiply(OilPalmExtent); // Excluding Oil Palm areas
    forest = forest.multiply(WaterExtent); // Excluding Water areas
    empty = empty.addBands(forest.rename(ee.String(year)));
}
var mapbiomas_forest = empty.select(empty.bandNames().slice(1));

// 1.1 Anthropic Mask
var empty = ee.Image().byte();
for (var i = 0; i < totalYears; i++)  {
    var y = firstYear + i;
    var year = 'classification_' + y;
    var anthropic = mapbiomas.select(year).remap([15, 18, 9, 35, 21, 24, 30, 25], [1, 1, 1, 1, 1, 1, 1, 1], 0).rename(ee.String(year));
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
    description: 'secondary_forest_increment_amazonia_'  + mapbiomasCollection + '_' + mappingVersion,
    assetId: assetFolder + '/secondary_forest_increment_amazonia_' + mapbiomasCollection + '_' + mappingVersion,
    scale: 30,
    region: aoi,
    maxPixels: 1e13
});

Export.image.toAsset({
    image: sforest_ext,
    description: 'secondary_forest_extent_amazonia_' + mapbiomasCollection + '_' + mappingVersion,
    assetId: assetFolder + '/secondary_forest_extent_amazonia_' + mapbiomasCollection + '_' + mappingVersion,
    scale: 30,
    region: aoi,
    maxPixels: 1e13
});

Export.image.toAsset({
    image: sforest_age,
    description: 'secondary_forest_age_amazonia_' + mapbiomasCollection + '_' + mappingVersion,
    assetId: assetFolder + '/secondary_forest_age_amazonia_' + mapbiomasCollection + '_' + mappingVersion,
    scale: 30,
    region: aoi,
    maxPixels: 1e13
});

Export.image.toAsset({
    image: sforest_loss,
    description: 'secondary_forest_loss_amazonia_' + mapbiomasCollection + '_' + mappingVersion,
    assetId: assetFolder + '/secondary_forest_loss_amazonia_' + mapbiomasCollection + '_' + mappingVersion,
    scale: 30,
    region: aoi,
    maxPixels: 1e13
});
