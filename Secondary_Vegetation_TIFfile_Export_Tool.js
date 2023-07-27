// Assets
var loss = ee.Image("users/celsohlsj/public/secondary_vegetation_loss_collection71_v5"),
    age = ee.Image("users/celsohlsj/public/secondary_vegetation_age_collection71_v5"),
    extent = ee.Image("users/celsohlsj/public/secondary_vegetation_extent_collection71_v5"),
    increment = ee.Image("users/celsohlsj/public/secondary_vegetation_increment_collection71_v5"),
    mapbiomas = ee.Image('users/celsohlsj/public/collection7_1/mapbiomas_collection71_integration_v1');

// Area of Interest (Brazil)
var aoi = ee.FeatureCollection("users/celsohlsj/brazil");

// Type of Vegetation //
// Here you select the type of secondary vegetation to be exported (forest or non-forest).
// Please refer to the legend document: https://mapbiomas-br-site.s3.amazonaws.com/downloads/_EN__C%C3%B3digos_da_legenda_Cole%C3%A7%C3%A3o_7.pdf
var type = 3; // 1.1. Forest Formation: 3
var vegetation_type = mapbiomas.select('classification_1985').eq(type);

// Save Datasets
for (var i=1986; i<2022; i++)  {
    var y = i;
    var year = 'classification_'+y;
    var export_year = age.select(year).multiply(vegetation_type);
    Export.image.toDrive({
          image: export_year,
          description: 'secondary_vegetation_age_v5_'+y, 
          scale: 30, 
          region: aoi,
          folder: 'secondary_vegetation_collection71_v5',
          maxPixels:1e13
});
}

for (var i=1986; i<2022; i++)  {
    var y = i;
    var year = 'classification_'+y;
    var export_year = extent.select(year).multiply(vegetation_type);
    Export.image.toDrive({
          image: export_year,
          description: 'secondary_vegetation_extent_v5_'+y, 
          scale: 30, 
          region: aoi,
          folder: 'secondary_vegetation_collection71_v5',
          maxPixels:1e13
});
}

for (var i=1986; i<2022; i++)  {
    var y = i;
    var year = 'classification_'+y;
    var export_year = increment.select(year).multiply(vegetation_type);
    Export.image.toDrive({
          image: export_year,
          description: 'secondary_vegetation_increment_v5_'+y, 
          scale: 30, 
          region: aoi,
          folder: 'secondary_vegetation_collection71_v5',
          maxPixels:1e13
});
}

for (var i=1987; i<2022; i++)  {
    var y = i;
    var year = 'classification_'+y;
    var export_year = loss.select(year).multiply(vegetation_type);
    Export.image.toDrive({
          image: export_year,
          description: 'secondary_vegetation_loss_v5_'+y, 
          scale: 30, 
          region: aoi,
          folder: 'secondary_vegetation_collection71_v5',
          maxPixels:1e13
});
}
