/**
 * @name
 * Brazilian Secondary Vegetation Toolkit Download - User vectores    
 * 
 * @description
 *      Adapted from Mapbiomas User Toolkit Download - User vectores.
 *  
 * @author
 *      Original Author 
 *      João Siqueira 
 *      contato@mapbiomas.org 
 * 
 *      Adaptation
 *      Juan Doblas
 *      juandb@gmail.com
 * 
 * @version
 *    0.0.2 - Second version
 * 
 */
var palettes = require('users/gena/packages:palettes');
palettes.colorbrewer.YlOrRd[9];
var image = ee.Image("users/celsohlsj/logo_ok");
var logo = ui.Thumbnail({image:image,params:{bands:['b1','b2','b3'],min:0,max:255},style:{width:'150px',height:'77px'}});var App = {

    options: {
        version: '0.0.2',
        logo: logo,
        assets: {
          
            age:'users/celsohlsj/public/secondary_forest_age_collection41_v2',
            extent:'users/celsohlsj/public/secondary_forest_extent_collection41_v2',
            increment:'users/celsohlsj/public/secondary_forest_increment_collection41_v2',
            loss: 'users/celsohlsj/public/secondary_forest_loss_collection41_v2',
            vectors: [
                'projects/mapbiomas-workspace/AUXILIAR/areas-protegidas',
                'projects/mapbiomas-workspace/AUXILIAR/municipios-2016',
                'projects/mapbiomas-workspace/AUXILIAR/estados-2017',
                'projects/mapbiomas-workspace/AUXILIAR/biomas',
                'projects/mapbiomas-workspace/AUXILIAR/bacias-nivel-1',
                'projects/mapbiomas-workspace/AUXILIAR/bacias-nivel-2',
            ]
        },

        statesNames: {
            'None': 'None',
            'Acre': '12',
            'Alagoas': '27',
            'Amazonas': '13',
            'Amapá': '16',
            'Bahia': '29',
            'Ceará': '23',
            'Distrito Federal': '53',
            'Espírito Santo': '32',
            'Goiás': '52',
            'Maranhão': '21',
            'Minas Gerais': '31',
            'Mato Grosso do Sul': '50',
            'Mato Grosso': '51',
            'Pará': '15',
            'Paraíba': '25',
            'Pernambuco': '26',
            'Piauí': '22',
            'Paraná': '41',
            'Rio de Janeiro': '33',
            'Rio Grande do Norte': '24',
            'Rondônia': '11',
            'Roraima': '14',
            'Rio Grande do Sul': '43',
            'Santa Catarina': '42',
            'Sergipe': '28',
            'São Paulo': '35',
            'Tocantins': '17'
        },

        periods: {
            'General': [
                '1986', '1987', '1988',
                '1989', '1990', '1991', '1992',
                '1993', '1994', '1995', '1996',
                '1997', '1998', '1999', '2000',
                '2001', '2002', '2003', '2004',
                '2005', '2006', '2007', '2008',
                '2009', '2010', '2011', '2012',
                '2013', '2014', '2015', '2016',
                '2017', '2018'
            ],
            'Loss': [
                '1987', '1988',
                '1989', '1990', '1991', '1992',
                '1993', '1994', '1995', '1996',
                '1997', '1998', '1999', '2000',
                '2001', '2002', '2003', '2004',
                '2005', '2006', '2007', '2008',
                '2009', '2010', '2011', '2012',
                '2013', '2014', '2015', '2016',
                '2017', '2018'
            ]

        },
        bandsNames: {
            'General': 'classification_',
        },

        dataType: 'Age',

        data: {
            'Forest_Age': null,
            'Forest_Extent': null,
            'Forest_Increment': null,
            'Forest_Loss': null
        },


        ranges: {
            'Forest_Age': {'min': 0,'max': 33},
            'Forest_Increment': {'min': 0,'max': 1},
            'Forest_Extent': {'min': 0,'max': 1},
            'Forest_Loss': {'min': 0,'max': 1}
        },

        vector: null,
        activeFeature: null,
        activeName: '',

        palette: {
            'Forest_Age': palettes.colorbrewer.YlOrRd[9],
            'Forest_Increment': ['ffffff', 'ff0000'],
            'Forest_Extent': ['ffffff', 'ff0000'],
            'Forest_Loss':  ['ffffff', 'ff0000'],

        },

        taskid: 1,

        bufferDistance: 0

       

    },

    init: function () {

        this.ui.init();
        this.loadImages();
        this.startMap();
    },

    setVersion: function () {

        App.ui.form.labelTitle.setValue('Brazilian Secondary Vegetation Toolkit ' + App.options.version);

    },

    loadImages: function () {

        App.options.data.Forest_Age = ee.Image(App.options.assets.age);
        App.options.data.Forest_Increment = ee.Image(App.options.assets.increment);
        App.options.data.Forest_Extent = ee.Image(App.options.assets.extent);
        App.options.data.Forest_Loss = ee.Image(App.options.assets.loss);

    },
//            'Mangrove_Age': null,
//            'Plantation_Age': null,
//            'Savanna_Age': null,
//            'Mangrove_Increment': null,
//            'Plantation_Increment': null,
//            'Savanna_Increment': null,

    startMap: function () {

        Map.centerObject(App.options.data.Forest_Age, 5);

        var imageLayer = ui.Map.Layer({
            'eeObject': App.options.data.Forest_Age,
            'visParams': {
                'bands': ['classification_2018'],
                'palette': App.options.palette.Forest_Age,
                'min': 0,
                'max': 33,
                'format': 'png'
            },
            'name': 'Secondary Vegetation 2018',
            'shown': true,
            'opacity': 1.0
        });

        Map.add(imageLayer);

    },

    formatName: function (name) {

        var formated = name
            .toLowerCase()
            .replace(/á/g, 'a')
            .replace(/à/g, 'a')
            .replace(/â/g, 'a')
            .replace(/ã/g, 'a')
            .replace(/ä/g, 'a')
            .replace(/ª/g, 'a')
            .replace(/é/g, 'e')
            .replace(/ê/g, 'e')
            .replace(/í/g, 'i')
            .replace(/ó/g, 'o')
            .replace(/ô/g, 'o')
            .replace(/õ/g, 'o')
            .replace(/ú/g, 'u')
            .replace(/û/g, 'u')
            .replace(/ũ/g, 'u')
            .replace(/ç/g, 'c')
            .replace(/ñ/g, 'n')
            .replace(/&/g, '')
            .replace(/@/g, '')
            .replace(/ /g, '')
            .replace(/["'()]/g, '');

        return formated;
    },


    ui: {

        init: function () {

            this.form.init();

        },

        setDataType: function (dataType) {

            App.options.dataType = dataType;

        },

        loadTablesNames: function () {

            App.ui.form.selectFeatureCollections.setPlaceholder('loading tables names...');

            var roots = ee.data.getAssetRoots()
                .map(
                    function (obj) {
                        return obj.id;
                    });

            var allTablesNames;

            /**
             * Skip the error msg if MAPBIOMAS folder is not found
             */
            try {
                var tablesNames = ee.data.getList({
                    'id': roots[0] + '/MAPBIOMAS'
                }).map(
                    function (obj) {
                        return obj.id;
                    });
                var allTablesNames = App.options.assets.vectors.concat(tablesNames);
            }
            catch (e) {
                var allTablesNames = App.options.assets.vectors;
            }

            App.ui.form.selectFeatureCollections = ui.Select({
                'items': ['None'].concat(allTablesNames),
                'placeholder': 'select table',
                'onChange': function (tableName) {
                    if (tableName != 'None') {
                        App.options.activeName = tableName;

                        if (tableName === App.options.assets.vectors[1]) {
                            App.ui.form.panelStates.add(App.ui.form.labelStates);
                            App.ui.form.panelStates.add(App.ui.form.selectStates);
                        } else {
                            App.ui.form.panelStates.remove(App.ui.form.labelStates);
                            App.ui.form.panelStates.remove(App.ui.form.selectStates);
                            ee.Number(1).evaluate(
                                function (a) {
                                    App.ui.loadTable(tableName);
                                    App.ui.makeLayersList(tableName.split('/')[3], App.options.activeFeature, App.options.periods.General);
                                    App.ui.loadPropertiesNames();
                                    App.ui.form.selectDataType.setDisabled(false);
                                }
                            );

                            App.ui.loadingBox();
                        }
                    }
                },
                'style': {
                    'stretch': 'horizontal'
                }
            });

            App.ui.form.panelFeatureCollections.widgets()
                .set(1, App.ui.form.selectFeatureCollections);

        },

        loadTableStates: function (tableName) {

            var state = App.ui.form.selectStates.getValue();

            App.options.table = ee.FeatureCollection(tableName)
                .filterMetadata('UF', 'equals', parseInt(App.options.statesNames[state], 10));

            App.options.activeFeature = App.options.table;

            Map.centerObject(App.options.activeFeature);

            Map.clear();

            Map.addLayer(App.options.activeFeature.style({
                color: 'ff0000',
                width: 1,
                fillColor: 'ff000033',
            }), {},
                tableName.split('/')[3],
                true);

        },

        loadTable: function (tableName) {

            App.options.table = ee.FeatureCollection(tableName);

            App.options.activeFeature = App.options.table;

            Map.centerObject(App.options.activeFeature);

            Map.clear();

            Map.addLayer(App.options.activeFeature.style({
                color: 'ff0000',
                width: 1,
                fillColor: 'ff000033',
            }), {},
                tableName.split('/')[3],
                true);

        },

        loadPropertiesNames: function () {

            App.ui.form.selectProperties.setPlaceholder('loading tables names...');

            ee.Feature(App.options.table.first()).propertyNames().evaluate(
                function (propertyNames) {
                    App.ui.form.selectProperties = ui.Select({
                        'items': ['None'].concat(propertyNames),
                        'placeholder': 'select property',
                        'onChange': function (propertyName) {
                            if (propertyName != 'None') {
                                App.options.propertyName = propertyName;

                                ee.Number(1).evaluate(
                                    function (a) {
                                        App.ui.loadFeatureNames(propertyName);
                                        App.ui.form.selectDataType.setDisabled(false);
                                    }
                                );

                            }
                        },
                        'style': {
                            'stretch': 'horizontal'
                        }
                    });

                    App.ui.form.panelProperties.widgets()
                        .set(1, App.ui.form.selectProperties);
                }
            );

        },

        loadFeatureNames: function () {

            App.ui.form.selectFeature.setPlaceholder('loading feature names...');

            App.options.table.sort(App.options.propertyName)
                .reduceColumns(ee.Reducer.toList(), [App.options.propertyName])
                .get('list')
                .evaluate(
                    function (featureNameList) {

                        // print(featureNameList);

                        App.ui.form.selectFeature = ui.Select({
                            'items': ['None'].concat(featureNameList),
                            'placeholder': 'select feature',
                            'onChange': function (featureName) {
                                if (featureName != 'None') {
                                    App.options.featureName = featureName;

                                    ee.Number(1).evaluate(
                                        function (a) {
                                            App.ui.loadFeature(featureName);
                                            App.ui.makeLayersList(featureName, App.options.activeFeature, App.options.periods.General);
                                            App.ui.form.selectDataType.setDisabled(false);
                                        }
                                    );

                                    App.ui.loadingBox();
                                }
                            },
                            'style': {
                                'stretch': 'horizontal'
                            }
                        });

                        App.ui.form.panelFeature.widgets()
                            .set(1, App.ui.form.selectFeature);
                    }
                );

        },

        loadFeature: function (name) {

            App.options.activeFeature = App.options.table
                .filterMetadata(App.options.propertyName, 'equals', name);

            Map.centerObject(App.options.activeFeature);

            Map.clear();

            Map.addLayer(App.options.activeFeature.style({
                color: 'ff0000',
                width: 1,
                fillColor: 'ff000033',
            }), {},
                name,
                true);

        },

        addImageLayer: function (period, label, region) {


            var image = App.options.data[App.options.dataType]
                .select([App.options.bandsNames.General + period])
                .clip(region);
            var imageLayer = ui.Map.Layer({
                'eeObject': image,
                'visParams': {
                    'palette': App.options.palette[App.options.dataType],
                    'min': App.options.ranges[App.options.dataType].min,
                    'max': App.options.ranges[App.options.dataType].max,
                    'format': 'png'
                },
                'name': label,
                'shown': true,
                'opacity': 1.0
            });

            Map.layers().insert(
                Map.layers().length() - 1,
                imageLayer
            );

        },

        removeImageLayer: function (label) {

            for (var i = 0; i < Map.layers().length(); i++) {

                var layer = Map.layers().get(i);

                if (label === layer.get('name')) {
                    Map.remove(layer);
                }
            }

        },

        manageLayers: function (checked, period, label, region) {

            if (checked) {
                App.ui.addImageLayer(period, label, region);
            } else {
                App.ui.removeImageLayer(label);
            }

        },

        makeLayersList: function (regionName, region, periods) {

            App.ui.form.panelLayersList.clear();

            periods.forEach(

                function (period, index, array) {
                    App.ui.form.panelLayersList.add(
                        ui.Checkbox({
                            "label": regionName + ' ' + period,
                            "value": false,
                            "onChange": function (checked) {

                                App.ui.manageLayers(checked, period, regionName + ' ' + period, region);

                            },
                            "disabled": false,
                            "style": {
                                'padding': '2px',
                                'stretch': 'horizontal',
                                'backgroundColor': '#dddddd',
                                'fontSize': '12px'
                            }
                        })
                    );

                }
            );

        },

        loadingBox: function () {
            App.ui.form.loadingBox = ui.Panel();
            App.ui.form.loadingBox.add(ui.Label('Loading...'));

            Map.add(App.ui.form.loadingBox);
        },

        export2Drive: function () {

            var layers = App.ui.form.panelLayersList.widgets();

            for (var i = 0; i < layers.length(); i++) {

                var selected = layers.get(i).getValue();

                if (selected) {

                    var period = App.options.periods.General[i];
                    var featureName = App.formatName(App.ui.form.selectFeature.getValue() || '');

                    var fileName = 'svBR-' + featureName + '-' + period;

                    fileName = fileName.replace(/--/g, '-').replace(/--/g, '-');
                    fileName = App.formatName(fileName);
                    print(fileName);
                    var taskId = ee.data.newTaskId(1);

                    var data = App.options.data[App.options.dataType]
                        .select([App.options.bandsNames.General + period]);

                    var region = App.options.activeFeature.geometry();

                    if (App.options.bufferDistance !== 0) {
                        data = data.clip(App.options.activeFeature.geometry().buffer(App.options.bufferDistance));
                        region = region.buffer(App.options.bufferDistance);
                    } else {
                        data = data.clip(App.options.activeFeature.geometry());
                    }

                    region = region.bounds();
                    // var params = {
                    //     type: 'EXPORT_IMAGE',
                    //     json: ee.Serializer.toJSON(data),
                    //     description: fileName,
                    //     driveFolder: 'MAPBIOMAS-EXPORT',
                    //     driveFileNamePrefix: fileName,
                    //     region: JSON.stringify(App.options.activeFeature.geometry().bounds().getInfo()),
                    //     scale: 30,
                    //     maxPixels: 1e13,
                    //     skipEmptyTiles: true,
                    //     fileDimensions: App.options.fileDimensions[App.options.dataType],
                    // };

                    // var status = ee.data.startProcessing(taskId, params);

                    // if (status) {
                    //     if (status.started == 'OK') {
                    //         print("Exporting data...");
                    //     } else {
                    //         print("Exporting error!");
                    //     }
                    // }

                    Export.image.toDrive({
                        image: data,
                        description: fileName,
                        folder: 'SVBR-EXPORT',
                        fileNamePrefix: fileName,
                        region: region,
                        scale: 30,
                        maxPixels: 1e13,
                        fileFormat: 'GeoTIFF',
                        //fileDimensions: App.options.fileDimensions[App.options.dataType],
                    });
                }
            }
        },

        form: {

            init: function () {

                this.panelMain.add(this.panelLogo);
                this.panelMain.add(this.labelTitle);
                this.panelMain.add(this.labelCollection);

                this.panelLogo.add(App.options.logo);

                this.panelFeatureCollections.add(this.labelTables);
                this.panelFeatureCollections.add(this.selectFeatureCollections);

                this.panelProperties.add(this.labelProperties);
                this.panelProperties.add(this.selectProperties);

                this.panelFeature.add(this.labelFeature);
                this.panelFeature.add(this.selectFeature);

                this.panelDataType.add(this.labelDataType);
                this.panelDataType.add(this.selectDataType);

                this.panelBuffer.add(this.labelBuffer);
                this.panelBuffer.add(this.selectBuffer);

                // this.panelMain.add(this.panelType);
                this.panelMain.add(this.panelFeatureCollections);
                this.panelMain.add(this.panelStates);
                this.panelMain.add(this.panelProperties);
                this.panelMain.add(this.panelFeature);
                this.panelMain.add(this.panelDataType);
                this.panelMain.add(this.panelBuffer);

                this.panelMain.add(this.labelLayers);
                this.panelMain.add(this.panelLayersList);

                this.panelMain.add(this.buttonExport2Drive);
                this.panelMain.add(this.labelNotes);

                ui.root.add(this.panelMain);

                App.ui.loadTablesNames();
            },

            panelMain: ui.Panel({
                'layout': ui.Panel.Layout.flow('vertical'),
                'style': {
                    'width': '360px',
                    'position': 'bottom-left',
                    'margin': '0px 0px 0px 0px',
                },
            }),

            panelLogo: ui.Panel({
                'layout': ui.Panel.Layout.flow('vertical'),
                'style': {
                    'margin': '0px 0px 0px 110px',
                },
            }),

            panelStates: ui.Panel({
                'layout': ui.Panel.Layout.flow('vertical'),
                'style': {
                    'stretch': 'horizontal'
                },
            }),

            panelFeatureCollections: ui.Panel({
                'layout': ui.Panel.Layout.flow('vertical'),
                'style': {
                    'stretch': 'horizontal'
                },
            }),

            panelProperties: ui.Panel({
                'layout': ui.Panel.Layout.flow('vertical'),
                'style': {
                    'stretch': 'horizontal'
                },
            }),

            panelFeature: ui.Panel({
                'layout': ui.Panel.Layout.flow('vertical'),
                'style': {
                    'stretch': 'horizontal'
                },
            }),

            panelDataType: ui.Panel({
                'layout': ui.Panel.Layout.flow('vertical'),
                'style': {
                    'stretch': 'horizontal'
                },
            }),

            panelBuffer: ui.Panel({
                'layout': ui.Panel.Layout.flow('vertical'),
                'style': {
                    'stretch': 'horizontal'
                },
            }),

            panelLayersList: ui.Panel({
                'layout': ui.Panel.Layout.flow('vertical'),
                'style': {
                    'height': '200px',
                    'stretch': 'vertical',
                    'backgroundColor': '#cccccc',
                },
            }),

            labelCollection: ui.Label('Based in the MapBiomas Collection 4.1', {
                'fontWeight': 'bold',
                'padding': '1px',
                'fontSize': '12px'
            }),

            labelTitle: ui.Label('MapBiomas User Toolkit', {
                'fontWeight': 'bold',
                'padding': '1px',
                'fontSize': '16px'
            }),

            labelType: ui.Label('Type:', {
                'padding': '1px',
                'fontSize': '16px'
            }),

            labelTables: ui.Label('Tables:', {
                'padding': '1px',
                'fontSize': '16px'
            }),

            labelProperties: ui.Label('Properties:', {
                'padding': '1px',
                'fontSize': '16px'
            }),

            labelFeature: ui.Label('Features:', {
                'padding': '1px',
                'fontSize': '16px'
            }),

            labelDataType: ui.Label('Data Type:', {
                'padding': '1px',
                'fontSize': '16px'
            }),

            labelBuffer: ui.Label('Buffer:', {
                'padding': '1px',
                'fontSize': '16px'
            }),

            labelLayers: ui.Label('Layers:', {
                'padding': '1px',
                'fontSize': '16px'
            }),

            labelNotes: ui.Label('Click on OK button to start the task.', {
                'padding': '1px',
                'fontSize': '16px'
            }),

            labelStates: ui.Label('States:', {
                'padding': '1px',
                'fontSize': '16px'
            }),

            selectName: ui.Select({
                'items': ['None'],
                'placeholder': 'None',
                'style': {
                    'stretch': 'horizontal'
                }
            }),

            selectFeatureCollections: ui.Select({
                'items': ['None'],
                'placeholder': 'None',
                'style': {
                    'stretch': 'horizontal'
                }
            }),

            selectFeature: ui.Select({
                'items': ['None'],
                'placeholder': 'None',
                'style': {
                    'stretch': 'horizontal'
                }
            }),

            selectProperties: ui.Select({
                'items': ['None'],
                'placeholder': 'None',
                'style': {
                    'stretch': 'horizontal'
                }
            }),

            selectDataType: ui.Select({
                'items': ['Forest_Age','Forest_Increment','Forest_Extent','Forest_Loss'],
                'placeholder': 'Forest_Age',
                'style': {
                    'stretch': 'horizontal'
                },
                'disabled': true,
                'onChange': function (dataType) {

                    App.ui.setDataType(dataType);
                    App.ui.makeLayersList(App.options.activeName, App.options.activeFeature, App.options.periods.General);

                },
            }),

            selectBuffer: ui.Select({
                'items': [
                    'None',
                    '1km',
                    '2km',
                    '3km',
                    '4km',
                    '5km',
                ],
                'placeholder': 'None',
                'style': {
                    'stretch': 'horizontal'
                },
                'onChange': function (distance) {
                    var distances = {
                        'None': 0,
                        '1km': 1000,
                        '2km': 2000,
                        '3km': 3000,
                        '4km': 4000,
                        '5km': 5000,
                    };

                    App.options.bufferDistance = distances[distance];
                },
            }),

            selectStates: ui.Select({
                'items': [
                    'None', 'Acre', 'Alagoas', 'Amazonas', 'Amapá', 'Bahia',
                    'Ceará', 'Distrito Federal', 'Espírito Santo', 'Goiás', 'Maranhão',
                    'Minas Gerais', 'Mato Grosso do Sul', 'Mato Grosso', 'Pará', 'Paraíba',
                    'Pernambuco', 'Piauí', 'Paraná', 'Rio de Janeiro', 'Rio Grande do Norte',
                    'Rondônia', 'Roraima', 'Rio Grande do Sul', 'Santa Catarina', 'Sergipe',
                    'São Paulo', 'Tocantins'
                ],
                'placeholder': 'select state',
                'onChange': function (state) {
                    if (state != 'None') {

                        ee.Number(1).evaluate(
                            function (a) {
                                App.ui.loadTableStates(App.options.activeName);
                                App.ui.makeLayersList(App.options.activeName.split('/')[3], App.options.activeFeature, App.options.periods.General);
                                App.ui.loadPropertiesNames();
                                App.ui.form.selectDataType.setDisabled(false);
                            }
                        );

                        App.ui.loadingBox();
                    }
                },
                'style': {
                    'stretch': 'horizontal'
                }
            }),

            buttonExport2Drive: ui.Button({
                "label": "Export images to Google Drive",
                "onClick": function () {
                    App.ui.export2Drive();
                },
                "disabled": false,
                "style": {
                    'padding': '2px',
                    'stretch': 'horizontal'
                }
            }),

        },
    }
};

App.init();

App.setVersion();
