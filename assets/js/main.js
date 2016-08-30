
angular
    .module('ddApp', ['lvl.directives.dragdrop']) // register the directive with your app module
    .controller('ddController', ['$scope' , function($scope){ // function referenced by the drop target


        // inicializa as células da matriz da tela.
        $scope.cells = [
            []
        ];

        //tamanhos
        var maxRow = 7;
        var maxCol = 7;
        var minRow = 3;
        var minCol = 3;
        $scope.sizes = [];

        $scope.length = minRow;
        $scope.width = minCol;

        $scope.$watch('[width,length]', makeMap, true);

        function makeMap() {
            var cols = $scope.width,
                rows = $scope.length;
            $scope.cells = matrix(rows, cols, 0);
        }

        function matrix(rows, cols, defaultValue) {
            var arr = [[]];

            // Creates all lines:
            for (var i = 0; i < rows; i++) {

                // Creates an empty line
                arr[i] = [];

                // Adds cols to the empty line:
                arr[i] = new Array(cols);

                for (var j = 0; j < cols; j++) {
                    // Initializes:
                    arr[i][j] = defaultValue;
                }
            }

            return arr;
        }

        makeMap();

        $scope.sizeChange = function (plus, row){
            var rows = $scope.length;
            var cols = $scope.width;

            if(plus){
                if(row && rows < maxRow)
                    $scope.length++;
                if(!row && cols < maxCol)
                    $scope.width++
            }else{
                if(row && rows > minRow)
                    $scope.length--;
                if(!row && cols > minRow)
                    $scope.width--
            }

            return true;
        }

        //array das categorias
        $scope.categorias = [
            {
                'nome' : "fantasia",
                'imgUrl' : "images/fantasia/0.png"
            },
            {
                'nome' : "floresta",
                'imgUrl' : "images/floresta/0.png"
            },
            {
                'nome' : "fazenda",
                'imgUrl' : "images/fazenda/0.png"
            },
            {
                'nome' : "cidade",
                'imgUrl' : "images/cidade/0.png"
            },
            {
                'nome' : "mar",
                'imgUrl' : "images/mar/0.png"
            }
        ];

        var tilesArray = [];
        $scope.tiles = tilesArray;

        $scope.selecionaCategoria = function(nomeCategoria){
            var tilesArray = [];
            var idC = nomeCategoria.substring(0,3);

            for(var i = 1; i < 6; i++ ){

                var tile = {
                    "id" : idC+"-"+i,
                    "categoria" : nomeCategoria,
                    "imgUrl" : "images/"+nomeCategoria+"/"+i+".png"
                };

                tilesArray.push(tile);
            }

            $scope.tiles = tilesArray;

        };




        $scope.dropped = function(dragEl, dropEl) {

            var drop = angular.element(dropEl);
            var drag = angular.element(dragEl);


            var isSlot = drag.hasClass("slot");


            var img = drag.attr("data-img");

            var id =  drag.attr('data-id');

            drop.attr("style","background-image:url("+img+")");
            drop.attr('data-img', img);
            drop.attr('data-id', id);

            if ((isSlot) && (drag.attr("x-lvl-drop-target"))) {
                drag.attr("style", "");
                drag.attr('data-img', "");
                drag.attr('data-id', "0");
            }


        }

        $("#expJ").click(function(){


            var matrizJ = [];

            var slotsId = new Array();


            $('.slot').each(function (key) {

                slotsId.push( $(this).attr('data-id')  );

            });


            for (var i = 0; i < $scope.length; i++){
                var linha = new Array();
                for (var j = 0; j < $scope.width; j++){
                    linha.push(  slotsId.shift()  );
                }
                matrizJ.push(linha);
            }

            var jsonDownload = {
                "linhas" : matrizJ.length,
                "colunas" : matrizJ[0].length,
                "matriz" : matrizJ
            }

            var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(jsonDownload));

            this.href = dataStr;
        });

        function idToImageUrl(id){

            var chunks = id.split("-");

            var categorias = {
                'fan' : 'fantasia',
                'faz' :  'fazenda',
                'flo' : 'floresta',
                'cid' : 'cidade',
                'mar' : 'mar'
            }

            var arr = [chunks.shift(), chunks.join('-')];

            return "images/"+categorias[arr[0]]+"/"+arr[1]+".png";

        }

        $("#impJ").change(function( evt ) {

            var files = evt.target.files; // FileList object

            var f = files[0];

            var reader = new FileReader();

            // Closure to capture the file information.
            reader.onload = (function(theFile) {
                return function(e) {
                    // Render thumbnail.
                    var jsonObj = JSON.parse(e.target.result);

                    $scope.length = jsonObj.linhas;
                    $scope.width = jsonObj.colunas;


                    $('.cat:first').trigger('click');

                    var ids = new Array();

                    for (var i = 0; i < jsonObj.linhas; i++){
                        for (var j = 0; j < jsonObj.colunas; j++){
                            ids.push( jsonObj.matriz[i][j]  );
                        }
                    }


                    $('.slot').each(function (key) {

                        var id = ids.shift();

                        $(this);

                        $(this).attr("style","background-image:url("+ idToImageUrl(id)  +")");
                        $(this).attr('data-img', idToImageUrl(id));
                        $(this).attr('data-id', id);

                    });

                };
            })(f);

            // Read in the image file as a data URL.
            reader.readAsText(f);

        });



    }]);




