// 0. MapBiomas Data (Colection 4.1)
var brazil = ee.FeatureCollection("users/celsohlsj/brazil");
var mapbiomas = ee.Image('projects/mapbiomas-workspace/public/collection4_1/mapbiomas_collection41_integration_v1').byte();

// 1. Reclassifying MapBiomas Data #Step 1
var nameBands = mapbiomas.bandNames().getInfo(); 
var dumb = nameBands.map(remapband);

function remapband(band){
  var oldvalues = ee.List([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33]);
  var newvalues = ee.List([0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
  var remap = mapbiomas.select(band).remap(oldvalues,newvalues);
  remap = remap.rename(ee.String(band).cat('_r'));
  mapbiomas = mapbiomas.addBands(remap);
}

var mapbiomas_forest = mapbiomas.select(mapbiomas.bandNames().slice(34));
var nameBands_f = mapbiomas_forest.bandNames().getInfo();

// 2. Mapping the Annual Secondary Vegetation  #Step 2
var empty = ee.Image().byte();

for (var i=1; i<34; i++)  {
    var y1 = 1984+i;
    var y2 = 1985+i;
    var year1 = 'classification_'+y1+'_r';
    var year2 = 'classification_'+y2+'_r';
    var forest1 = mapbiomas_forest.select(year1).remap([0,1],[0,2]);
    var forest2 = mapbiomas_forest.select(year2);
    var sforest = forest1.add(forest2);
    sforest = sforest.remap([0,1,2,3],[0,1,0,0]).rename(ee.String(year2).cat("_s"));
    empty = empty.addBands(sforest);
}
var sforest_all = empty.select(empty.bandNames().slice(1));

// 3. Mapping the Accumulated Secondary Vegetation  #Step 3
var empty = ee.Image().byte();
var age = sforest_all.select('classification_1986_r_s');
age = age.rename(ee.String('classification_1986_r_s_acm'));
empty = empty.addBands(age);

for (var i=1; i<33; i++)  {
    var y = 1986+i;
    var y2 = 1985+i;
    var year = 'classification_'+y+'_r_s';
    var year2 = 'classification_'+y2+'_r_s_acm';
    var sforest = sforest_all.select(year);
    var acm_forest = empty.select(year2).add(sforest);
    var oldvalues = ee.List([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33]);
    var newvalues = ee.List([0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]);
    var remap = acm_forest.remap(oldvalues,newvalues);
    empty = empty.addBands(remap.rename(ee.String(year).cat("_acm")));
}
var acm_sforest = empty.select(empty.bandNames().slice(1));

// 4. Calculating the Age of Secondary Vegetation  #Step 4
var empty = ee.Image().byte();
var age = acm_sforest.select('classification_1986_r_s_acm');
age = age.rename(ee.String('classification_1986_r_s_acm_age'));
empty = empty.addBands(age);
var empty = empty.slice(1);
var empty2 = empty;

for (var i=1; i<33; i++)  {
    var y = 1986+i;
    var year = 'classification_'+y+'_r_s_acm';
    var sforest = acm_sforest.select(year);
    var ageforest = empty.add(sforest);
    var year2 = 'classification_'+y+'_r';
    var FYear = mapbiomas_forest.select(year2);
    ageforest = ageforest.multiply(FYear);
    empty2 = empty2.addBands(ageforest.rename(ee.String(year).cat("_age")));
    var empty = ageforest;
}
var sforest_age = empty2;

// Export Data to Google Drive
Export.image.toAsset({
          image: sforest_all,
          description: 'secondary_forest_collection41_v1', 
          scale: 30, 
          region: brazil,
          maxPixels:1e13
});

Export.image.toAsset({
          image: sforest_age,
          description: 'secondary_forest_age_collection41_v1', 
          scale: 30, 
          region: brazil,
          maxPixels:1e13
});
