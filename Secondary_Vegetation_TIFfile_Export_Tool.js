// Configuration variables
var collection = 'collection9';         // Collection name
var mappingVersion = 'v71';               // Mapping version
var lastYear = 2023;                      // Last year to export
var startYear = 1986;                     // Start year for age, extent, and increment datasets
var lossStartYear = 1987;                 // Start year for loss dataset

///// Assets /////
var loss = ee.Image("users/ybyrabr/public/secondary_vegetation_loss_" + collection + "_" + mappingVersion),
    age = ee.Image("users/ybyrabr/public/secondary_vegetation_age_" + collection + "_" + mappingVersion),
    extent = ee.Image("users/ybyrabr/public/secondary_vegetation_extent_" + collection + "_" + mappingVersion),
    increment = ee.Image("users/ybyrabr/public/secondary_vegetation_increment_" + collection + "_" + mappingVersion),
    mapbiomas = ee.Image('projects/mapbiomas-public/assets/brazil/lulc/collection9/mapbiomas_collection90_integration_v1');

// Area of Interest (Brazil)
// Replace this with your own area of interest if needed.
var aoi = ee.FeatureCollection("users/celsohlsj/brazil");

///// Vegetation Type /////
// Select the type of secondary vegetation to export (forest or non-forest).
// Refer to the legend: https://brasil.mapbiomas.org/wp-content/uploads/sites/4/2024/10/Legenda-Colecao-9-LEGEND-CODE_v2.pdf
var type = 3; // 1.1. Forest Formation: 3
var vegetation_type = mapbiomas.select('classification_1985').eq(type);

// Export datasets for "age", "extent", and "increment"
for (var i = startYear; i < lastYear + 1; i++)  {
    var year = 'classification_' + i;
    var exportImage = age.select(year).multiply(vegetation_type);
    Export.image.toDrive({
          image: exportImage,
          description: 'secondary_vegetation_age_' + mappingVersion + '_' + i, 
          scale: 30, 
          region: aoi,
          folder: 'secondary_vegetation_' + collection + '_' + mappingVersion,
          maxPixels: 1e13
    });
}

for (var i = startYear; i < lastYear + 1; i++)  {
    var year = 'classification_' + i;
    var exportImage = extent.select(year).multiply(vegetation_type);
    Export.image.toDrive({
          image: exportImage,
          description: 'secondary_vegetation_extent_' + mappingVersion + '_' + i, 
          scale: 30, 
          region: aoi,
          folder: 'secondary_vegetation_' + collection + '_' + mappingVersion,
          maxPixels: 1e13
    });
}

for (var i = startYear; i < lastYear + 1; i++)  {
    var year = 'classification_' + i;
    var exportImage = increment.select(year).multiply(vegetation_type);
    Export.image.toDrive({
          image: exportImage,
          description: 'secondary_vegetation_increment_' + mappingVersion + '_' + i, 
          scale: 30, 
          region: aoi,
          folder: 'secondary_vegetation_' + collection + '_' + mappingVersion,
          maxPixels: 1e13
    });
}

// Export datasets for "loss" (starting in 1987)
for (var i = lossStartYear; i < lastYear + 1; i++)  {
    var year = 'classification_' + i;
    var exportImage = loss.select(year).multiply(vegetation_type);
    Export.image.toDrive({
          image: exportImage,
          description: 'secondary_vegetation_loss_' + mappingVersion + '_' + i, 
          scale: 30, 
          region: aoi,
          folder: 'secondary_vegetation_' + collection + '_' + mappingVersion,
          maxPixels: 1e13
    });
}
