var smoothieBlender = (function() {
    
    var exports = {};
    
    
    var originalYumminess = {apple: 4, banana: 7, blueberry: 9, cherry: 3, grape: 3, lemon: 2, lime: 2, mango: 8, orange: 7, peach: 5, pear: 4, pineapple: 5, raspberry: 7, strawberry: 9};
    
    //names of fruit
    var fruitArray = {apple:[originalYumminess.apple, 1.5, "#E2342D", "sweet", "chunky", "conventional"], banana:[originalYumminess.banana, .5, "#FFE971", "sweet", "smooth", "tropical"], blueberry:[originalYumminess.blueberry, 2, "#6897FF", "sweet", "chunky", "conventional"], cherry:[originalYumminess.cherry, 3, "#FF3233", "sweet", "chunky", "conventional"], grape:[originalYumminess.grape, 4, "#B171CB", "sweet", "chunky", "conventional"], lemon:[originalYumminess.lemon, .25, "#FFEF1D", "sour", "smooth", "conventional"], lime:[originalYumminess.lime, .5, "#7AC50D", "sour", "smooth", "conventional"], mango:[originalYumminess.mango, 6, "#FFF03F", "sweet", "smooth", "tropical"], orange:[originalYumminess.orange, 1, "#F6A122", "sweet", "smooth", "tropical"], peach:[originalYumminess.peach, 2, "#FFC77B", "sweet", "smooth", "conventional"], pear:[originalYumminess.pear, 1, "#DDE551", "sweet", "chunky", "conventional"], pineapple:[originalYumminess.pineapple, 2, "#FFDA08", "sweet", "chunky", "tropical"], raspberry:[originalYumminess.raspberry, 1.5, "#EC3414", "sour", "chunky", "conventional"], strawberry:[originalYumminess.strawberry, 7, "#EA3927", "sweet", "smooth", "conventional"]};
    
    
    
    //maximum price set by user
    var price;
    
    var scenarios = [{text: "red fruits are poisonous", fruit:["apple", "cherry", "raspberry", "strawberry"], effect:"none"}, {text: "you're low on vitamin c! use an orange", fruit:["orange"], effect:"req"}, {text: "limes are extra expensive today", fruit:["lime"], effect:"expensive"}];
    
    //make cost pretty
    function monify(cost) {
        var monifiedCost = cost;
        if (cost%1 != 0 && (cost*10)%1 == 0) {
            monifiedCost = cost + "0";
        } else if (cost%1 == 0) {
            monifiedCost = cost + ".00";
        }
        monifiedCost = "$"+monifiedCost;
        return monifiedCost;
    }
    
    //add all the draggable fruit
    function addFruitList() {
        
        var fruitList = $("<ul id='fruits' class='connectedSortable'></ul>");
        
        for (var fruit in fruitArray) {
            
            fruitList.append($("<li><img src='"+fruit+".png' data-yumminess='"+fruitArray[fruit][0]+"' data-cost='"+fruitArray[fruit][1]+"' data-name='"+fruit+"' class='fruit-tile'><span class='fruit-label'>"+fruit+"<br>"+fruitArray[fruit][0]+" yums, "+monify(fruitArray[fruit][1])+"</span></li>"));
            
        }
        $(".fruitsSpan").empty()
        $(".fruitsSpan").append(fruitList);
        
    }
    
    //add the place to drop the draggable fruit
    function addSmoothieList() {
        
        var smoothieList = $("<ul id='smoothie' class='connectedSortable'></ul>");
        $(".smoothieSpan").empty();
        $(".smoothieSpan").append(smoothieList);
        smoothieList.css("height", $("#fruits").css("height"));
        
    }
    
    //add the preference sliders
    function addSliders(div) {
        
        var sweetnessSliderContainer = $("<div class='row-fluid'><div class='span2 leftSliderLabel'>sweet</div><div class='span8'></div><div class='span2'>sour</div></div>");
        sweetnessSliderContainer.find('.span8').append($("<div id='sweetnessSlider'></div>"));
        div.append(sweetnessSliderContainer);
        
        var smoothnessSliderContainer = $("<div class='row-fluid'><div class='span2 leftSliderLabel'>smooth</div><div class='span8'></div><div class='span2'>chunky</div></div>");
        smoothnessSliderContainer.find('.span8').append($("<div id='smoothnessSlider'></div>"));
        div.append(smoothnessSliderContainer);
        
        var tropicalitySliderContainer = $("<div class='row-fluid'><div class='span2 leftSliderLabel'>tropical</div><div class='span8'></div><div class='span2'>conventional</div></div>");
        tropicalitySliderContainer.find('.span8').append($("<div id='tropicalitySlider'></div>"));
        div.append(tropicalitySliderContainer);
        
        var hungerSliderContainer = $("<div class='row-fluid'><div class='span2 leftSliderLabel'>peckish</div><div class='span8'></div><div class='span2'>ravenous</div></div>");
        hungerSliderContainer.find('.span8').append($("<div id='hungerSlider'></div>"));
        div.append(hungerSliderContainer);
        
    }
    
    //add a color preference wheel
    function addColor(div) {
        
        div.append($("<div class='row-fluid'>favorite color</div>"));
        div.append($("<div class='row-fluid'><div class='span2 redSlider'></div><div class='span2 greenSlider'></div><div class='span2 blueSlider'></div><div class='span6 swatch'></div></div>"))
        
    }
    
    function hexFromRGB(r, g, b) {
        var hex = [
          r.toString( 16 ),
          g.toString( 16 ),
          b.toString( 16 )
        ];
        $.each( hex, function( nr, val ) {
          if ( val.length === 1 ) {
            hex[ nr ] = "0" + val;
          }
        });
        return hex.join( "" ).toUpperCase();
      }
    
    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    
    function stringToRgb(rgbString) {
        var rgb = rgbString.substring(4,rgbString.indexOf(")"));
        rgb = rgb.split(", ");
        return {r:rgb[0],g:rgb[1],b:rgb[2]};
    }
    
    function refreshSwatch() {
        var red = $( ".redSlider" ).slider( "value" ),
          green = $( ".greenSlider" ).slider( "value" ),
          blue = $( ".blueSlider" ).slider( "value" ),
          hex = hexFromRGB( red, green, blue );
        $( ".swatch" ).css( "background-color", "#" + hex );
      }
    
    function addApply(div) {
        
        var newSmoothieButton = $("<button class='btn newSmoothie'>new smoothie</button>");
        var scenarioDiv = $("<div class='scenarioDiv'></div>");
        div.append(newSmoothieButton, scenarioDiv);
        
    }
    
    function newScenario() {
        var rand1 = Math.floor(Math.random()*scenarios.length);
        var rand2 = Math.floor(Math.random()*scenarios.length);
        while (rand1 == rand2) {
            rand2 = Math.floor(Math.random()*scenarios.length);
        }
        var rand3 = Math.floor(Math.random()*scenarios.length);
        while (rand1 == rand3 || rand2 == rand3) {
            rand3 = Math.floor(Math.random()*scenarios.length);
        }
        return [scenarios[rand1], scenarios[rand2], scenarios[rand3]];
    }
    
    function newSmoothie(fruitsSpan, smoothieSpan) {
        var newScenarios = newScenario();
        $('.scenarioDiv').empty();
        $('.scenarioDiv').append("<br>"+newScenarios[0].text+"<br>"+newScenarios[1].text+"<br>"+newScenarios[2].text);
        
        var sweetness = 5-$('#sweetnessSlider').slider("value");
        var smoothness = 5-$('#smoothnessSlider').slider("value");
        var tropicality = 5-$('#tropicalitySlider').slider("value");
        price = $('#hungerSlider').slider("value");
        var favoriteColor = stringToRgb($(".swatch").css("background-color"));
        
        
        for (var fruit in fruitArray) {
            
            var fruitColor = hexToRgb(fruitArray[fruit][2]);
            var rDiff = Math.abs(fruitColor.r-favoriteColor.r);
            var gDiff = Math.abs(fruitColor.g-favoriteColor.g);
            var bDiff = Math.abs(fruitColor.b-favoriteColor.b);
            var colorDiff = rDiff+gDiff+bDiff;
            
            if (sweetness>0) {
                if (fruitArray[fruit][3]=="sweet") {
                    fruitArray[fruit][0] = originalYumminess[fruit]+sweetness
                } else {
                    fruitArray[fruit][0] = originalYumminess[fruit]
                }
            } else if (sweetness<0) {
                if (fruitArray[fruit][3]=="sour") {
                    fruitArray[fruit][0] = originalYumminess[fruit]-sweetness
                } else {
                    fruitArray[fruit][0] = originalYumminess[fruit]
                }
            } else {
                fruitArray[fruit][0] = originalYumminess[fruit];
            }
            
            if (smoothness>0) {
                
                if (fruitArray[fruit][4]=="smooth") {
                    fruitArray[fruit][0] = fruitArray[fruit][0]+smoothness
                    console.log(fruitArray[fruit][0]);
                }
            } else if (smoothness<0) {
                if (fruitArray[fruit][4]=="chunky") {
                    fruitArray[fruit][0] = fruitArray[fruit][0]-smoothness
                }
            }
            
            if (tropicality>0) {
                if (fruitArray[fruit][5]=="tropical") {
                    fruitArray[fruit][0] = fruitArray[fruit][0]+tropicality
                }
            } else if (tropicality<0) {
                if (fruitArray[fruit][5]=="conventional") {
                    fruitArray[fruit][0] = fruitArray[fruit][0]-tropicality
                }
            }
            
                
            if (colorDiff<40) {
                fruitArray[fruit][0] = fruitArray[fruit][0]+4;
            } else if (colorDiff<80) {
                fruitArray[fruit][0] = fruitArray[fruit][0]+3;
            } else if (colorDiff<150) {
                fruitArray[fruit][0] = fruitArray[fruit][0]+2;
            } else if (colorDiff<250) {
                fruitArray[fruit][0] = fruitArray[fruit][0]+1;
            }
        }
        
        
        addFruitList();
        addSmoothieList();
        $( "#fruits, #smoothie" ).sortable({
          connectWith: ".connectedSortable", handle: "img", update: updateStatus
        }).disableSelection();
    }
    
    function updateStatus() {
        var smoothieFruits = $(".smoothieSpan").find(".fruit-tile");
        var totalCost = 0;
        var totalYums = 0;
        smoothieFruits.each(function() {
            totalCost += parseFloat($(this).attr("data-cost"));
            totalYums += parseInt($(this).attr("data-yumminess"));
        });
        $(".totalCost").text(monify(totalCost));
        $(".totalYums").text(totalYums);
        $("#smoothie").css("height", $("#fruits").css("height"));
    }
    
    $(window).resize(function() {
        $("#smoothie").css("height", $("#fruits").css("height"));
    });
    
    function newAlert(warningText) {
        $(".alertRow").append($('<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">&times;</button>'+warningText+'</div>'))
    
    }
    
    function addStatus(div) {
        div.append($("<div>total yumminess: <span class='totalYums'>0</span></div><div>total cost: <span class='totalCost'>$0</span></div><button class='btn blendSmoothieButton'>blend smoothie</div>"));
    }
    
    function blendSmoothie() {
        if ($('#smoothie').length==0) {
            newAlert("you don't have a smoothie to blend yet! try clicking 'blend new.'");
        }
    }
    
    //setup structure of app
    function setup(div) {
        
        var mainContainer = $("<div class='container-fluid'></div>");
        
        //row with the drag and drop functionality
        var dragAndDropRow = $("<div class='row-fluid'></div>");
        var applySpan = $("<div class='span2 applySpan well'></div>");
        var fruitsSpan = $("<div class='span4 fruitsSpan well'></div>");
        var smoothieSpan = $("<div class='span4 smoothieSpan well'></div>");
        var statusSpan = $("<div class='span2 well'></div>");
        addApply(applySpan);
        addStatus(statusSpan);
        dragAndDropRow.append(applySpan, fruitsSpan, smoothieSpan, statusSpan);
        
        //row where the user sets preferences
        var preferencesRow = $("<div class='row-fluid'></div>");
        var slidersSpan = $("<div class='span8 well'></div>");
        var slidersContainer = $("<div class='container-fluid'></div>");
        var colorSpan = $("<div class='span4 well'></div>");
        var colorContainer = $("<div class='container-fluid'></div>");
        addSliders(slidersContainer);
        addColor(colorContainer);
        preferencesRow.append(slidersSpan.append(slidersContainer), colorSpan.append(colorContainer));
        
        mainContainer.append($("<div class='row-fluid title'><h1>J&uumlst Fr&uumlit Smoothie Blender</h1></div>"));
        mainContainer.append(preferencesRow);
        mainContainer.append($("<div class='row-fluid alertRow'></div>"));
        mainContainer.append(dragAndDropRow);
        div.append(mainContainer);
        
        
        
        $("#sweetnessSlider, #smoothnessSlider, #tropicalitySlider, #hungerSlider").slider({min: 1, max: 10, value: 5});
        
        $( ".redSlider, .greenSlider, .blueSlider" ).slider({
          orientation: "vertical",
          range: "min",
          max: 255,
          value: 127,
          slide: refreshSwatch,
          change: refreshSwatch
        });
        refreshSwatch();
        
        $(".newSmoothie").on("click", newSmoothie);
        
        $(".redSlider, .greenSlider, .blueSlider").find(".ui-slider-handle").css("width","100%").css("height","10px").css("margin-left", "-1px").css("left","0");
        $(".redSlider").find(".ui-slider-handle").css("border", "1px solid red");
        $(".greenSlider").find(".ui-slider-handle").css("border", "1px solid green");
        $(".blueSlider").find(".ui-slider-handle").css("border", "1px solid blue");
        
        
        $(".blendSmoothieButton").on("click",blendSmoothie);
    };
    
    exports.setup = setup;
    
    return exports;
}());

$(document).ready(function() {
    smoothieBlender.setup($('.smoothieBlender'));
});