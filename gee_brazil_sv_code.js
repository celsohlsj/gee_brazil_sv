// Brazilian Secondary Forests Maping v4
// ******************************************************************************************
//  * Institution:  National institute for space Research (INPE)
//  * Purpose:      Map the increment, extent, age and loss of secondary forests in Brazil.
//  * Author:       Celso H. L. Silva Junior
//  * Email:        celsohlsj@gmail.com
// ******************************************************************************************

// 0. MapBiomas Data (Colection 6.0)
var brazil = ee.FeatureCollection("users/celsohlsj/brazil");
var mapbiomas = ee.Image('projects/mapbiomas-workspace/public/collection6/mapbiomas_collection60_integration_v1').byte(); //MapBiomas Collection 5
//https://mapbiomas-br-site.s3.amazonaws.com/downloads/Colecction%206/Cod_Class_legenda_Col6_MapBiomas_BR.pdf

// 1. Reclassifying MapBiomas Data #Step 1
var empty = ee.Image().byte();

for (var i=1; i<37; i++)  {
    var y = 1984+i;
    var year = 'classification_'+y;
    var forest = mapbiomas.select(year).eq(3);
    empty = empty.addBands(forest);
}
var mapbiomas_forest = empty.select(empty.bandNames().slice(1));

// 1.1 Anthropic and Water Mask
var empty = ee.Image().byte();
for (var i=1; i<37; i++)  {
    var y = 1984+i;
    var year = 'classification_'+y;
    var forest = mapbiomas.select(year).remap([14,15,18,19,39,20,40,41,36,46,47,48,9,21],[1,1,1,1,1,1,1,1,1,1,1,1,1,1]).rename(ee.String(year)).unmask(0);
    empty = empty.addBands(forest);
}
var anthropic_mask = empty.select(empty.bandNames().slice(1));

var w_mask = ee.Image("JRC/GSW1_3/GlobalSurfaceWater").select("max_extent").clip(brazil).remap([0,1],[1,0]);

// 2. Mapping the Annual Increment of Secondary Forests  #Step 2
var empty = ee.Image().byte();
for (var i=0; i<35; i++)  {
    var y1 = 1985+i;
    var y2 = 1986+i;
    var year1 = 'classification_'+y1;
    var year2 = 'classification_'+y2;
    var a_mask = anthropic_mask.select(year1);
    var forest1 = mapbiomas_forest.select(year1).remap([0,1],[0,2]);
    var forest2 = mapbiomas_forest.select(year2);
    var sforest = forest1.add(forest2);
    sforest = sforest.remap([0,1,2,3],[0,1,0,0]).multiply(a_mask).multiply(w_mask).rename(ee.String(year2));
    empty = empty.addBands(sforest);
}
var sforest_all = empty.select(empty.bandNames().slice(1));

// 3. Mapping the Annual Extent of Secondary Forests  #Step 3
var empty = ee.Image().byte();
var ext = sforest_all.select('classification_1986');
ext = ext.rename(ee.String('classification_1986'));
empty = empty.addBands(ext);
for (var i=1; i<35; i++)  {
    var y = 1986+i;
    var y2 = 1985+i;
    var year = 'classification_'+y;
    var year2 = 'classification_'+y2;
    var sforest = sforest_all.select(year);
    var acm_forest = empty.select(year2).add(sforest);
    var oldvalues = ee.List([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35]);
    var newvalues = ee.List([0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]);
    var remap = acm_forest.remap(oldvalues,newvalues);
    empty = empty.addBands(remap.multiply(mapbiomas_forest.select(year)).rename(ee.String(year)));
}
var sforest_ext = empty.select(empty.bandNames().slice(1));

// 3.1 Secondary Forest Loss
var empty = ee.Image().byte();
var empty2 = ee.Image().byte();
var ext = sforest_all.select('classification_1986');
ext = ext.rename(ee.String('classification_1986'));
empty = empty.addBands(ext);
for (var i=1; i<35; i++)  {
    var y = 1986+i;
    var y2 = 1985+i;
    var year = 'classification_'+y;
    var year2 = 'classification_'+y2;
    var sforest = sforest_all.select(year);
    var acm_forest = empty.select(year2).add(sforest);
    var oldvalues = ee.List([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35]);
    var newvalues = ee.List([0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]);
    var remap = acm_forest.remap(oldvalues,newvalues);
    var mask = mapbiomas_forest.select(year).remap([0,1],[500,1]);
    var loss = remap.add(mask).remap([1,2,500,501],[0,0,0,1]);
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
for (var i=1; i<35; i++)  {
    var y = 1986+i;
    var year = 'classification_'+y;
    var sforest = sforest_ext.select(year);
    var ageforest = empty.add(sforest);
    var fYear = mapbiomas_forest.select(year);
    ageforest = ageforest.multiply(fYear);
    temp = temp.addBands(ageforest.rename(ee.String(year)));
    var empty = ageforest;
}
var sforest_age = temp;

// Export Products Data to Google Drive
Export.image.toDrive({
          image: sforest_all,
          description: 'secondary_forest_increment_collection6_v4', 
          scale: 30, 
          region: brazil,
          maxPixels:1e13
});

Export.image.toDrive({
          image: sforest_ext,
          description: 'secondary_forest_extent_collection6_v4', 
          scale: 30, 
          region: brazil,
          maxPixels:1e13
});

Export.image.toDrive({
         image: sforest_age,
          description: 'secondary_forest_age_collection6_v4', 
          scale: 30, 
          region: brazil,
          maxPixels:1e13
});

Export.image.toDrive({
         image: sforest_loss,
          description: 'secondary_forest_loss_collection6_v4', 
          scale: 30, 
          region: brazil,
          maxPixels:1e13
});



//Export Products Data to Asset
Export.image.toAsset({
          image: sforest_all,
          description: 'secondary_forest_increment_collection6_v4', 
          scale: 30, 
          region: brazil,
          maxPixels:1e13
});

Export.image.toAsset({
          image: sforest_ext,
          description: 'secondary_forest_extent_collection6_v4', 
          scale: 30, 
          region: brazil,
          maxPixels:1e13
});

Export.image.toAsset({
          image: sforest_age,
          description: 'secondary_forest_age_collection6_v4', 
          scale: 30, 
          region: brazil,
          maxPixels:1e13
});

Export.image.toAsset({
          image: sforest_loss,
          description: 'secondary_forest_loss_collection6_v4', 
          scale: 30, 
          region: brazil,
          maxPixels:1e13
});
