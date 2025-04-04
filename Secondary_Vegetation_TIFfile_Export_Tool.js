///// Assets /////
var loss = ee.Image("users/ybyrabr/public/secondary_vegetation_loss_collection9_v71"),
    age = ee.Image("users/ybyrabr/public/secondary_vegetation_age_collection9_v71"),
    extent = ee.Image("users/ybyrabr/public/secondary_vegetation_extent_collection9_v71"),
    increment = ee.Image("users/ybyrabr/public/secondary_vegetation_increment_collection9_v71"),
    mapbiomas = ee.Image('projects/mapbiomas-public/assets/brazil/lulc/collection9/mapbiomas_collection90_integration_v1');

// Area of Interest (Brazil)
// Here the user can replace it with their area of ​​interest
var aoi = ee.FeatureCollection("users/celsohlsj/brazil");

///// Type of Vegetation /////
// Here you select the type of secondary vegetation to be exported (forest or non-forest).
// Please refer to the legend document: https://brasil.mapbiomas.org/wp-content/uploads/sites/4/2024/10/Legenda-Colecao-9-LEGEND-CODE_v2.pdf
var type = 3; // 1.1. Forest Formation: 3
var vegetation_type = mapbiomas.select('classification_1985').eq(type);

// Save Datasets
for (var i=1986; i<2024; i++)  {
    var y = i;
    var year = 'classification_'+y;
    var export_year = age.select(year).multiply(vegetation_type);
    Export.image.toDrive({
          image: export_year,
          description: 'secondary_vegetation_age_v61_'+y, 
          scale: 30, 
          region: aoi,
          folder: 'secondary_vegetation_collection8_v61',
          maxPixels:1e13
});
}

for (var i=1986; i<2024; i++)  {
    var y = i;
    var year = 'classification_'+y;
    var export_year = extent.select(year).multiply(vegetation_type);
    Export.image.toDrive({
          image: export_year,
          description: 'secondary_vegetation_extent_v61_'+y, 
          scale: 30, 
          region: aoi,
          folder: 'secondary_vegetation_collection8_v61',
          maxPixels:1e13
});
}

for (var i=1986; i<2024; i++)  {
    var y = i;
    var year = 'classification_'+y;
    var export_year = increment.select(year).multiply(vegetation_type);
    Export.image.toDrive({
          image: export_year,
          description: 'secondary_vegetation_increment_v61_'+y, 
          scale: 30, 
          region: aoi,
          folder: 'secondary_vegetation_collection8_v61',
          maxPixels:1e13
});
}

for (var i=1987; i<2024; i++)  {
    var y = i;
    var year = 'classification_'+y;
    var export_year = loss.select(year).multiply(vegetation_type);
    Export.image.toDrive({
          image: export_year,
          description: 'secondary_vegetation_loss_v61_'+y, 
          scale: 30, 
          region: aoi,
          folder: 'secondary_vegetation_collection8_v5',
          maxPixels:1e13
});
}
