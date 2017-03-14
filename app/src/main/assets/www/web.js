/**
 * Created by lsb on 2017/2/27.
 */

var curWwwPath = window.location.pathname.split("/")[1];
console.log(curWwwPath);
var Map = function () {
    this.elements = [];

    this.size = function () {
        return this.elements.length;
    };

    this.isEmpty = function () {
        return (this.elements.length < 1);
    };

    this.clear = function () {
        this.elements.length = 0;
    };

    this.put = function (_key, _value) {
        this.elements.push({
            key: _key,
            value: _value
        });
    };

    this.remove = function (_key) {
        try {
            for (var i = 0; i < this.size(); i++) {

                if (this.elements[i].key == _key)
                    this.elements.splice(i, 1);
                return true;
            }
        } catch (e) {
            return false;
        }
        return false;
    };

    this.get = function (_key) {

        try {
            for (var i = 0; i < this.size(); i++) {
                if (this.elements[i].key == _key) {
                    var _value = this.elements[i].value;
                    return _value;
                }
            }
        } catch (e) {
            return null;
        }
        return null;
    };

    this.containsKey = function (_key) {
        try {
            for (var i = 0; i < this.size(); i++) {
                if (this.elements[i].key == _key) {
                    return true;
                }
            }
        } catch (e) {
            return false;
        }
        return false;
    };


    this.getValues = function () {
        var values = [];
        try {
            for (var i = 0; i < this.size(); i++) {
                values.push(this.elements[i].value);
            }
        } catch (e) {
            alert("Can not get Map Values ! {1}" + e.message);
            return null;
        }
        return values;
    };

    this.getKeys = function () {
        var keys = [];
        try {
            for (var i = 0; i < this.size(); i++) {
                keys.push(this.elements[i].key);
            }
        } catch (e) {
            alert("Can not get Map Keys ! {1}" + e.message);
            return null;
        }
        return keys;
    };

    this.mapStr = function () {
        return this.elements.toString();

    }

};
//构建天地图服务
//wgs84
var tdtProvider1 = new Cesium.WebMapTileServiceImageryProvider({
    url: 'http://t4.tianditu.com/vec_c/wmts?',
    layer: 'vec',
    style: 'default',
    format: 'tiles',
    tileMatrixSetID: 'c',
    maximumlevel: 18,
    alpha: 1.0,
    show: true,
    tilingScheme: new Cesium.GeographicTilingScheme(),
    tileMatrixLabels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18']
});
//web墨卡托矢量
var tdtProvider = new Cesium.WebMapTileServiceImageryProvider({
    url: 'http://t4.tianditu.com/vec_w/wmts?',
    layer: 'vec',
    style: 'default',
    format: 'tiles',
    tileMatrixSetID: 'w',
    maximumlevel: 3,
    alpha: 1.0,
    show: true,
});
//web墨卡托影像
var tdtImageProvider = new Cesium.WebMapTileServiceImageryProvider({
    url: 'http://t2.tianditu.com/img_w/wmts?',
    layer: 'img',
    style: 'default',
    format: 'tiles',
    tileMatrixSetID: 'w',
    maximumlevel: 3,
    alpha: 1.0,
    show: true
}); //web墨卡托影像BIAOZHU
var tdtbzImageProvider = new Cesium.WebMapTileServiceImageryProvider({
    url: 'http://t0.tianditu.com/cia_w/wmts?',
    layer: 'cia',
    style: 'default',
    format: 'tiles',
    tileMatrixSetID: 'w',
    maximumlevel: 3,
    alpha: 1.0,
    show: true
});

//标注
var ciaProvider = new Cesium.WebMapTileServiceImageryProvider({
    url: 'http://t1.tianditu.com/cva_c/wmts?',
    layer: 'cva',
    style: 'default',
    format: 'tiles',
    tileMatrixSetID: 'c',
    maximumlevel: 18,
    tilingScheme: new Cesium.GeographicTilingScheme(),
    tileMatrixLabels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18'],
    alpha: 1.0,
    show: true
});

//创建图层控件
var imageryViewModels = [];
imageryViewModels.push(new Cesium.ProviderViewModel({
    name: '天地图影像',
    iconUrl: Cesium.buildModuleUrl('Widgets/Images/ImageryProviders/bingAerial.png'),
    tooltip: '天地图web墨卡托影像图',
    creationFunction: function () {
        return tdtImageProvider;
    }
}));
imageryViewModels.push(new Cesium.ProviderViewModel({
    name: '天地图地图',
    iconUrl: Cesium.buildModuleUrl('Widgets/Images/ImageryProviders/tianditu.png'),
    tooltip: '天地图web墨卡托矢量图',
    creationFunction: function () {
        return tdtProvider;
    }
}));
imageryViewModels.push(new Cesium.ProviderViewModel({
    name: 'Bing影像',
    iconUrl: Cesium.buildModuleUrl('Widgets/Images/ImageryProviders/bingAerial.png'),
    tooltip: 'Bing影像',
    creationFunction: function () {
        return new Cesium.BingMapsImageryProvider({
            url: 'https://dev.virtualearth.net',
            key: '2YMwiQZhIlVwJ9adpsas~Z_bApBryAFRfHWpYrmVloQ~AnPs-mAWM_WSCE69ypfH3J1SSFg1t7py7AGs_BVkivDbZyGrqjyiInGeNQdqr0-R',
            mapStyle: Cesium.BingMapsStyle.AERIAL
        });
    }
}));
var osmProvider = new Cesium.createOpenStreetMapImageryProvider({
    url: 'https://a.tile.openstreetmap.org/'
});
imageryViewModels.push(new Cesium.ProviderViewModel({
    name: 'OSM地图',
    iconUrl: Cesium.buildModuleUrl('Widgets/Images/ImageryProviders/openStreetMap.png'),
    tooltip: 'OpenStreetMap',
    creationFunction: function () {
        return osmProvider;
    }
}));
//获取服务器地址
var initialurl = curWwwPath + '/GetInitialLayers.do';
console.log(initialurl);

//初始化视角
var viewer = new Cesium.Viewer('cesiumContainer', {
//imageryProvider:Cesium.createOpenStreetMapImageryProvider({url:'http://a.tile.openstreetmap.org/',maximumlevel:19}),
    imageryProvider: tdtImageProvider,
    animation: true, //是否创建动画小器件，左下角仪表
    baseLayerPicker: true, //是否显示图层选择器
    imageryProviderViewModels: imageryViewModels,
    terrainProviderViewModels: [],
    fullscreenButton: false, //是否显示全屏按钮
    geocoder: false, //是否显示geocoder小器件，右上角查询按钮
    homeButton: false, //是否显示Home按钮
    infoBox: true, //是否显示信息框
    sceneModePicker: true, //是否显示3D/2D选择器
    selectionIndicator: false, //是否显示选取指示器组件
    timeline: true, //是否显示时间轴
    navigationHelpButton: false, //是否显示右上角的帮助按钮
    scene3DOnly: false, //如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
    navigationInstructionsInitiallyVisible: false,
    showRenderLoopErrors: false
});
var camera = viewer.scene.camera;
camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(108.9, 34.267, 20000000)
});
var myMap = new Map();
var imageryLayers = viewer.imageryLayers;
var data = {xmlname: "LayersCollection"};
var username = $.cookie("username");
if (username != undefined && username != "null") {
    $("#btnLog").remove();
    $("#btnRegist").remove();
    var a = $("<a></a").text("退出登录");
    a.id = "btnOut";
    a.css("cursor", "pointer");
    $("#menuRight").on("click", "a", function () {
        $.cookie('username', null);
        location.reload();
    });
    var li = $("<li></li>");
    li.prepend(a);
    $("#menuRight").prepend(li);
    data = {xmlname: username};
}
var ztlength;
//载入xml配置文件通过使用jquery动态初始化图层及相关控件（开关 透明度 多时相按钮）

InitialZhuantiLayers(viewer, initialurl);
function InitialZhuantiLayers(viewer, initialurl) {
    $.getJSON(initialurl, data, function (result) {
        console.log(JSON.stringify(result));
        ztlength = result.layers.layer.length;
        $.each(result.layers, function (index, layer) {
            $.each(layer, function (key, value) {
                var scheme, currenturl;
                if (value.coordinate == "c") {
                    scheme = new Cesium.GeographicTilingScheme();
                    currenturl = curWwwPath + "GetTile.do?params={z}/{x}/{y}/" + value.name + "/" + username;
                }
                var region = value.region.split(",");
                var rectangle = Cesium.Rectangle.fromDegrees(region[0], region[1], region[2], region[3]);
                var currentProvider = new Cesium.UrlTemplateImageryProvider({
                    url: currenturl,
                    credit: value.credit,
                    tilingScheme: scheme,
                    maximumLevel: value.maxlevel,
                    rectangle: rectangle
                });
                if (value.coordinate == "WMS") {
                    currentProvider = new Cesium.ArcGisMapServerImageryProvider({
                        credit: value.credit,
                        url: value.urlSource
                    });
                }


                var ks = key + 1;
                $("#list-select").append("<option name='value.credit' value=" + ks + ">" + value.credit + "</option>");

                var spanhtml = "<span></span>";
                var span = $(spanhtml).css({}).appendTo($("#divcollection"));
                var labelhtml = "<label class=\"checkbox-inline\"></label>";
                var checkid = "check" + key;
                var inputhtml = "<input id=" + checkid + " checked type=\"checkbox\" data-toggle=\"data-toggle\">" + value.credit;
                var check = $(inputhtml).css({"cursor": "hand"}).appendTo(span);
                var creditlabelhtml = "<label>" + value.credit + "</label>";
                var credit = $(creditlabelhtml).css({"cursor": "pointer", "width": "75px"}).appendTo(span);
                var sliderlabelhtml = "<label class=\"in-range\"</label>";
                var sliderlabel = $(sliderlabelhtml).css({"font-size": "16px", "margin-left": "20px"}).appendTo(span);
                var exid = "ex" + key;
                var sliderinputhtml = "<input id=" + exid + " data-slider='exqSlider' type=\"text\" data-slider=\"0\" data-slider-max=\"100\" data-slider-step=\"1\" data-slider-value=\"100\"></input>";
                $(sliderinputhtml).appendTo(sliderlabel);
                var labeltmdhtml = "<label>透明度</label>";
                $(labeltmdhtml).css({
                    "font-size": "14px",
                    "color": "black",
                    "margin-left": "10px",
                    "margin-top": "4px",
                    "margin-right": "4px"
                }).appendTo(span);
                var kk = key + 1;
                var cid = 'btnCompare' + kk;
                var comparehtml = "<button id=" + cid + " target=\"_self\" class=\"button button-glow button-border button-rounded button-primary button-tiny\" >对比</button>";
                var compare = $(comparehtml).appendTo(span);

                $(compare).on("click", this, function () {
                    var compreprms = {"filepath": value.name, "credit": value.credit, "region": region};
                    showInformation(value.credit, kk, compreprms);
                });
                if (value.isMulti == "Y") {
                    var ahtml = "<a id=\"btnMultiTime1\" target=\"_blank\" href=\"" + curWwwPath + "page/multi.jsp?" + value.region + "\" class=\"button button-glow button-border button-rounded button-primary button-tiny\" >多时相</a>";
                    $(ahtml).css({"margin-left": "5px"}).appendTo(span);
                }
                var br = "<br/>";
                $(br).appendTo(span);
                if (value.urlSource == "GetTile") {

                }
                //初始化透明度
                $("#" + exid).slider({
                    ticks_tooltip: false
                });
                var layer = addAdditionalLayerOption(value.name, currentProvider, 1, value.credit, false);
                $("#" + exid).on("slide", function (slideEvt) {
                    layer.alpha = slideEvt.value / 100;
                });
                //初始化开关
                $(check).bootstrapToggle({
                    on: '开',
                    off: '关',
                    size: 'mini'
                });
                $(check).bootstrapToggle('off');
                $(credit).on("click", this, function () {
                    var x = (parseFloat(region[0]) + parseFloat(region[2])) / 2;
                    var y = (parseFloat(region[1]) + parseFloat(region[3])) / 2;
                    var camera = viewer.scene.camera;
                    camera.flyTo({
                        destination: rectangle
                    });
                });
                $(check).change(function () {
                    if ($(this).prop('checked').toString() == 'true') {
                        layer.show = true;
                    } else {
                        layer.show = false;
                    }
                });
            });
        });
    });
}
//添加额外图层，初始化图层时候用

function addAdditionalLayerOption(name, imageryProvider, alpha, credit, show) {
    var layer = imageryLayers.addImageryProvider(imageryProvider);
    imageryLayers.raiseToTop(layer);
    layer.alpha = Cesium.defaultValue(alpha, 1);
    layer.show = Cesium.defaultValue(show, true);
    layer.name = name;

    myMap.put(credit, imageryLayers.indexOf(layer));
    return layer;
    // Cesium.knockout.track(layer, ['alpha', 'show', 'name']);
}
addAdditionalLayerOption("bz", tdtbzImageProvider, 1, "标注", true);


var startdate = "2016-02-21T09:09:29.807Z";
var enddate = "2017-08-21T09:09:29.807Z";
var geojsonlist;
$('#reservation2').daterangepicker(null, function (start, end, label) {
    startdate = start.toISOString();
    enddate = end.toISOString();
});
String.prototype.NoSpace = function () {
    return this.replace(/\s+/g, "");
};

var shpgeojson;
var citygeojson;
//点击查询按钮进行查询
$("#queryButton").click(function () {
    //  alert("asd");
    $('#checkEvryPic').bootstrapToggle('off');
    if ($('#queryResult').attr("class") == "panel-collapse collapse") {
        $('#queryResult').attr("class", "panel-collapse collapse in");
    }
    //空间条件
    if (typeof (shpgeojson) != "undefined") {
        geojsonlist = shpgeojson;
    }
    if (typeof (citygeojson) != "undefined") {
        geojsonlist = citygeojson;
    }

    var pri = viewer.scene.primitives;
    var tran = 180 / 3.14159265;
    for (var i = scene.primitives.length - 1; i > 0; i--) {
        var primitive = scene.primitives.get(i);

        if (Cesium.defined(primitive.center)) {

        }
        if (Cesium.defined(primitive.extent)) {
            var extent = primitive.extent;
            var left = extent.west * tran;
            var right = extent.east * tran;
            var up = extent.north * tran;
            var down = extent.south * tran;
            var outextent = {
                "type": "Polygon",
                "coordinates": [[[left, up], [right, up], [right, down], [left, down], [left, up]]]
            };
            geojsonlist = outextent;
        }
        if (Cesium.defined(primitive.positions)) {
            var ellipsoid = viewer.scene.globe.ellipsoid;
            var coordinates = [];
            for (var j = 0; j < primitive.positions.length; j++) {
                var xyz = new Cesium.Cartesian3(primitive.positions[j].x, primitive.positions[j].y, primitive.positions[j].z);
                var wgs84 = ellipsoid.cartesianToCartographic(xyz);
                var coor = [wgs84.longitude * tran, wgs84.latitude * tran];
                coordinates.push(coor);
            }
            var polygon = {
                "type": "Polygon",
                "coordinates": [coordinates]
            };
            geojsonlist = JSON.stringify(polygon);
        }
    }
    $.fn.stringify = function () {
        return JSON.stringify(this);
    };

    //属性条件


    var dataTypearray = [];
    $($("input[id^='iCheckboxDT']")).each(function () {
        if ($(this).parent().attr("class") == "icheckbox_polaris checked") {
            dataTypearray.push($(this).parent().next().html().NoSpace());
        }
    });

    var dataZhuantiarray = [];
    $($("input[id^='iCheckboxZT']")).each(function () {
        if ($(this).parent().attr("class") == "icheckbox_polaris checked") {
            dataZhuantiarray.push($(this).parent().next().html().NoSpace());
        }
    });

    $('#resultTable').bootstrapTable('refresh', {silent: true});
    $('#resultTable').bootstrapTable({
        url: curWwwPath + "GetMosaicQueryResult.do",
        method: 'post',
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        queryParams: function queryParams(params) {   //设置查询参数
            var param = {
                start: startdate.substr(0, 10),
                end: enddate.substr(0, 10),
                datatype: dataTypearray.toString(),
                datazt: dataZhuantiarray.toString(),
                geojsons: $(geojsonlist).stringify()
            };
            return param;
        },
        pagination: true, //分页
        singleSelect: true,
        locale: "zh-US", //表格汉化
        search: true, //显示搜索框,
        sidePagination: "client",
        pageNumber: 1,
        pageSize: 10,
        pageList: [5, 10, 15, 50, 100],
        showColumns: true,
        showPaginationSwitch: true,
        showRefresh: true,
        showToggle: true,
        smartDisplay: true,
        detailView: true,
        detailFormatter: function (index, row, element) {
            // var div = '<div>';
            // var iframe = '<iframe frameborder=0 width=480 height=150 marginheight=0 marginwidth=0 scrolling=no src=/page/operate.jsp>  </iframe>' ;
            // var div2 = '</div>';
            // return div+iframe+div2;
            var cdata = {};
            var html = template("text", cdata);
            return html;

        },
        onLoadSuccess: function (data) {
            console.log(data);
        },
        columns: [{
            field: 'image_name',
            align: 'center',
            title: '名称'
        }, {
            field: 'image_category',
            align: 'center',
            title: '影像类型'
        },
            {
                field: 'Image_capture_time',
                align: 'center',
                title: '时间'
            },
            {
                field: 'image_level',
                align: 'center',
                title: '数据等级'
            },
            {
                field: 'image_authority_level',
                align: 'center',
                title: '您的等级'
            },
            {
                field: 'collect',
                title: '收藏',
                align: 'center',
                events: "operateEvents",
                formatter: function (value, row, index) {
                    var a = '<a class = "collect" href="javascript:void(0)" Title="将影像添加到我的收藏">收藏</a>';
                    $(a).click(function () {
                        alert("a");
                    });
                    return a;
                }
            },
            {
                field: 'compare',
                title: '对比',
                align: 'center',
                events: "operateEvents",
                formatter: function (value, row, index) {
                    var a = '<a class = "compare" href="javascript:void(0)" Title="将影像添加到对比栏">对比</a>';
                    $(a).click(function () {
                        alert("a");
                    });
                    return a;
                }
            }]
    });

    window.operateEvents = {
        'click .collect': function (e, value, row, index) {
            var region = row["image_region"];
            if (!myMap.containsKey(row["image_name"])) {
                var rectangle = Cesium.Rectangle.fromDegrees(region[0], region[1], region[2], region[3]);

                var curprovider = new Cesium.UrlTemplateImageryProvider({
                    url: curWwwPath + "GetTile.do?params={z}/{x}/{y}/" + row["image_file_path"] + "/" + username,
                    credit: row["image_name"],
                    tilingScheme: new Cesium.GeographicTilingScheme(),
                    maximumLevel: row["level"],
                    rectangle: rectangle
                });

                var layer = addAdditionalLayerOption(row["id"], curprovider, 1, row["image_name"], false);
                var key = ztlength;
                var ks = key + 1;
                $("#list-select").append("<option name='value.credit' value=" + ks + ">" + row["image_name"] + "</option>");

                var spanhtml = "<span></span>";
                var span = $(spanhtml).css({}).appendTo($("#divcollection"));
                var labelhtml = "<label class=\"checkbox-inline\"></label>";
                var checkid = "check" + key;
                var inputhtml = "<input id=" + checkid + " checked type=\"checkbox\" data-toggle=\"data-toggle\">" + row["name"];
                var check = $(inputhtml).css({"cursor": "hand"}).appendTo(span);
                var creditlabelhtml = "<label>" + row["image_name"] + "</label>";
                var credit = $(creditlabelhtml).css({"cursor": "pointer", "width": "75px"}).appendTo(span);
                var sliderlabelhtml = "<label class=\"in-range\"</label>";
                var sliderlabel = $(sliderlabelhtml).css({"font-size": "16px", "margin-left": "20px"}).appendTo(span);
                var exid = "ex" + key;
                var sliderinputhtml = "<input id=" + exid + " data-slider='exqSlider' type=\"text\" data-slider=\"0\" data-slider-max=\"100\" data-slider-step=\"1\" data-slider-value=\"100\"></input>";
                $(sliderinputhtml).appendTo(sliderlabel);
                var labeltmdhtml = "<label>透明度</label>";
                $(labeltmdhtml).css({
                    "font-size": "14px",
                    "color": "black",
                    "margin-left": "10px",
                    "margin-top": "4px"
                }).appendTo(span);
                var kk = key + 1;
                var cid = 'btnCompare' + kk;

                var comparehtml = "<a id=" + cid + " target=\"_self\"  class=\"button button-glow button-border button-rounded button-primary button-tiny\" >对比</a>";
                var compare = $(comparehtml).appendTo(span);
                $(compare).on("click", function () {
                    var compreprms = {
                        "filepath": row["image_file_path"],
                        "credit": row["image_name"],
                        "region": region
                    };
                    showInformation(row["image_name"], kk, compreprms);
                });
                ztlength = ztlength + 1;
                var br = "<br/>";
                $(br).appendTo(span);
                //初始化透明度
                $("#" + exid).slider({
                    ticks_tooltip: false
                });
                $("#" + exid).on("slide", function (slideEvt) {
                    layer.alpha = slideEvt.value / 100;
                });
                //初始化开关
                $(check).bootstrapToggle({
                    on: '开',
                    off: '关',
                    size: 'mini'
                });
                $(check).bootstrapToggle('off');
                $(credit).on("click", this, function () {
                    var x = (parseFloat(region[0]) + parseFloat(region[2])) / 2;
                    var y = (parseFloat(region[1]) + parseFloat(region[3])) / 2;
                    var camera = viewer.scene.camera;
                    camera.flyTo({
                        destination: rectangle
                    });
                });
                $(check).change(function () {
                    if ($(this).prop('checked').toString() == 'true') {
                        layer.show = true;
                    } else {
                        layer.show = false;
                    }
                });

            } else {
                alert("您的收藏中已存在“" + row["name"] + "”");
            }
        },
        'click .compare': function (e, value, row, index) {
            var key = comparejson.length;
            var compreprms = {
                "filepath": row["image_file_path"],
                "credit": row["image_name"],
                "region": row["image_region"]
            };
            var isExist = false;
            $.each(comparejson, function (idx, obj) {

                if (obj.credit == row["image_name"]) {

                    alert("对比栏中已经存在");
                    isExist = true;

                }
            });

            if (!isExist) {
                var kk = key + 1;

                showInformation(row["image_name"], kk, compreprms);
            }

        }
    };
});


//初始化高级产品属性checkbox
$($("input[id^='iCheckbox']")).each(function () {
    $(this).iCheck({
        checkboxClass: 'icheckbox_polaris'
    });
});
//登录
$(document).ready(function () {


    $('#reservation3').daterangepicker(null, function (start, end, label) {

    });
    $("#reservation3").on('apply.daterangepicker', function () {

    });

    //登录
    $("#btnSubmit").click(function () {
        var data = {
            username: $('#username').val(),
            password: $('#password').val()
        };
        $.ajax({
            type: "post",
            url: curWwwPath + "Login.do",
            data: data,
            dataType: 'text',
            success: function (result) {
                if (result != "用户名或密码错误") {
                    $.cookie("username", result);
                    $('#LoginBox').modal('hide');
                    location.reload();
                }
            },
            error: function () {
                console.log('error')
            }
        });
    });

});
//地图HOME键
$("#btnNorth").click(function () {
    var camera = viewer.scene.camera;
    if (camerapo.x != 0) {
        camera.flyTo({
            //                destination: Cesium.Cartesian3.fromDegrees(108.9, 34.267, 10000000.34038727246224)
            destination: camerapo
        });
    }
});
//地图HOME键
$("#btnHome").click(function () {
    var camera = viewer.scene.camera;
    var position = camera.position;
    camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(108.9, 34.267, 10000000.34038727246224)
    });
});
$("#clearall").on("click", function () {
    clearGeojsonAndEntity();
});
function clearGeojsonAndEntity() {
    for (var i = scene.primitives.length - 1; i > 0; i--) {
        var primitive = scene.primitives.get(i);
        if (Cesium.defined(primitive._textureAtlas)) {
            scene.primitives.remove(primitive);
        }
        if (Cesium.defined(primitive.extent)) {
            scene.primitives.remove(primitive);
        }
        if (Cesium.defined(primitive.positions)) {
            scene.primitives.remove(primitive);
        }
    }
    if (viewer.dataSources.length > 1) {
        var curgeojson = viewer.dataSources.get(viewer.dataSources.length - 1);
        var dts = viewer.dataSources.remove(curgeojson);
    }
}

//tyt()显示出左边的下拉框和整体的div
function tyt() {
    var cm = "comparepop-content";
    var cme = document.getElementsByClassName(cm)[0];
    if ((cme.style.visibility.toString()) == "hidden") {
        cme.style.visibility = "visible";
    } else {
        cme.style.visibility = "hidden";
    }

    var icid = "tyt";
    var icc = document.getElementById(icid);
    if (icc.className == "icon10 icon10-left") {
        $(icc).attr("class", "icon10 icon10-right");
    } else {
        $(icc).attr("class", "icon10 icon10-left");
    }
}

function hahah(parameters) {
    var hideded = "hidede";
    var hE = document.getElementById(hideded);
    if (hE.style.display.toString() == "block") {
        hE.style.display = "none";
    } else {
        hE.style.display = "block";
    }
}

//huanyuan() 隐藏除了下拉框的其他元素
function huanyuan() {
    var ul = "comparepop-list";
    var ule = document.getElementsByClassName(ul)[0];
    $(ule).find("li").remove();
    $(ule).attr("style", "height: 0px;overflow: hidden");      //删除ul中添加的li元素，并且复原ul出书状态

    //隐藏第三部分div
    var acsbe = document.getElementsByClassName("area comparepop-select-btn")[0];
    $(acsbe).attr("style", "display:none;width=300px;");

    var lnie = document.getElementsByClassName("comparepop-content")[0];
    $(lnie).attr("style", "height: 50px;width: 300px");

    //显示被选择的下拉列表元素
    var numbers = document.getElementById("list-select").getElementsByTagName("option").length;
    for (var i = 0; i < numbers; i++) {
        document.getElementsByTagName("option")[i].style.display = "";
    }
    document.getElementsByTagName("option")[0].selected = "selected";

    //恢复按钮状态
    var num = document.getElementsByTagName("option").length;
    for (var i = 1; i < num; i++) {
        var di = '#btnCompare' + i;
        $(di).removeAttr("disabled");
    }
    comparejson.length = 0;
    localStorage.setItem("comparejson", "");

}

//下拉列表的实现
var listName = document.getElementById('list-name-for-select');
var listSelect = document.getElementById('list-select').onchange = function (e) {
    if (this.value) {
        listName.value = this.options[this.selectedIndex].text;
        showInformation(listName.value, this.value);
    } else {
        listName.value = '-请选择-';
    }
};

function hideinfo() {
    if ($(".comparepop-list li").length == 0) {
        document.getElementById("compare").style.display = "none";
    } else {
        alert("存在对比项！");
    }
}

//信息按钮所完成的工作 msg是要显示的内容，indexs是在下拉列表中的位置
var comparejson = [];
function showInformation(msg, indexs, compreprms) {
    document.getElementById("compare").style.display = "block";
    tyt();
    var cmct = document.getElementsByClassName("comparepop-content")[0];
    $(cmct).attr("style", "height: auto;width: 300px");
    var ul = document.getElementsByClassName("comparepop-list")[0];
    $(ul).attr("style", "height: auto");
    var disanlan = document.getElementsByClassName("area comparepop-select-btn")[0];
    disanlan.style.display = "block";
    var obj = document.createElement("li");
    obj.innerHTML = msg + "<i class=\"icon16 icon16-close\" style=\"float: right\" onclick='remove()'></i>";
    if (document.getElementsByTagName("option").length - 1 >= indexs) {
        document.getElementsByTagName("option")[indexs].style.display = "none";
    }
    if ($(".comparepop-list li").length < 4) {
        ul.appendChild(obj);
        var idx = "#btnCompare" + indexs;
        $(idx).attr("disabled", true);
        //             document.getElementById(idx).disabled = "true";
        console.log(compreprms);
        comparejson.push(compreprms);
    } else {
        alert("最多可以选择四个专题！");
    }
}

//点击×按钮，删除这个信息,并且还原按钮状态，在列表中显示信息
function remove() {
    $("li").click(function () {
        var num = $(this).index() + 1;
        var idx = "#btnCompare" + num;
        $(idx).removeAttr("disabled");
    });
    $("li").on("click", this, function () {
        var index = $(this).index();
        $(".comparepop-list").find("li")[index].remove();
        document.getElementsByTagName("option")[index + 1].style.display = "";
        if ($(".comparepop-list li").length == 0) {
            huanyuan();
        }

        comparejson.splice(index, 1);
        localStorage.setItem("comparejson", JSON.stringify(comparejson));
    });

}

$('#btnStratCompre').on("click", function () {
    if ($(".comparepop-list li").length < 2) {
        alert("请至少选取两组对比");
    } else {
        var length = $(".comparepop-list li").length;
        localStorage.setItem("comparejson", JSON.stringify(comparejson));
        localStorage.setItem("length", comparejson.length);

        window.open(curWwwPath + "page/compare.jsp");
    }

});


//鼠标获取经纬度
// getPosition();
function getPosition() {
    //得到当前三维场景
    var scene = viewer.scene;
    //得到当前三维场景的椭球体
    var ellipsoid = scene.globe.ellipsoid;
    var entity = viewer.entities.add({
        label: {
            show: false
        }
    });
    var longitudeString = null;
    var latitudeString = null;
    var height = null;
    var cartesian = null;
    // 定义当前场景的画布元素的事件处理
    var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    //设置鼠标移动事件的处理函数，这里负责监听x,y坐标值变化
    handler.setInputAction(function (movement) {
        //通过指定的椭球或者地图对应的坐标系，将鼠标的二维坐标转换为对应椭球体三维坐标
        cartesian = viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid);

        if (cartesian) {
            //将笛卡尔坐标转换为地理坐标
            var cartographic = ellipsoid.cartesianToCartographic(cartesian);
            //将弧度转为度的十进制度表示
            longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
            latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
            //获取相机高度
            height = Math.ceil(viewer.camera.positionCartographic.height);
            entity.position = cartesian;
            entity.label.show = true;
            entity.label.text = '(' + longitudeString + ', ' + latitudeString + "," + height + ')';
        } else {
            entity.label.show = false;
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    //设置鼠标滚动事件的处理函数，这里负责监听高度值变化
    handler.setInputAction(function (left) {
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}