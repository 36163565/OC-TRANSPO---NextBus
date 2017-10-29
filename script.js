
    // Create the XHR object.
    function createCORSRequest(method, url) {
      var xhr = new XMLHttpRequest();
      if ("withCredentials" in xhr) {
        // XHR for Chrome/Firefox/Opera/Safari.
        xhr.open(method, url, true);
      } else if (typeof XDomainRequest != "undefined") {
        // XDomainRequest for IE.
        xhr = new XDomainRequest();
        xhr.open(method, url);
      } else {
        // CORS not supported.
        xhr = null;
      }   
      return xhr;
    }

    var tripDetails = "";
    
    function getBusDetails(text) {
        parser = new DOMParser();
        xmlDoc = parser.parseFromString(text,"text/xml");
        stopDetails = xmlDoc.getElementsByTagName("GetRouteSummaryForStopResponse");
        findStopInfo(stopDetails);
        var routeDetails = xmlDoc.getElementsByTagName("Route");
        if ( routeDetails.length !== 0){
            findRouteInfoNew(routeDetails);
        }else{
           throwError();   
        }
    }    
        
    $(document).on('click','thead',function(){
        var demo = $(this).closest('table').find('tbody');
       $(this).closest('table').find('tbody').toggle();
    });
    
     function findRouteInfoNew(xml_list){
         var theTable = document.getElementById('MainTable');

         var newRow, newCell, i, j;
         for(i=0;i<xml_list.length;i++){
            var tableNode = document.createElement('table');
            tableNode.className = "table";
            var header = tableNode.createTHead();
            var body = tableNode.createTBody();
            body.className = "body"; 
            newRow = header.insertRow(0);
            newRow.insertCell(0).innerHTML= '<span class="label label-primary">ROUTE</span> ' + xml_list[i].getElementsByTagName('RouteNo')[0].innerHTML;
            newRow.insertCell(1).innerHTML = '<span class="label label-primary">TOWARDS</span> ' + xml_list[i].getElementsByTagName('RouteHeading')[0].innerHTML; 
            newRow.insertCell(2).innerHTML = '<span class="label label-primary">DIRECTION</span> ' + xml_list[i].getElementsByTagName('Direction')[0].innerHTML;
  
             var tripsList = xml_list[i].getElementsByTagName('Trips')[0].childNodes;
             if( tripsList.length === 0){
                 newRow = body.insertRow(0);
                 newRow.insertCell(0).innerHTML = '<span class="label label-danger">No Trips Available</span> ';
                 newRow.insertCell(1).innerHTML = '<span class="label label-danger">No Trips Available</span> ';
                 newRow.insertCell(2).innerHTML = '<span class="label label-danger">No Trips Available</span> ';
             }

             for(j=0; j<tripsList.length;j++){
                 newRow = body.insertRow(j);
                 newRow.insertCell(0).innerHTML = tripsList[j].getElementsByTagName('TripStartTime')[0].innerHTML + '<br>' + '<span class="label label-info">SCHED</span> ';
                 newRow.insertCell(1).innerHTML= tripsList[j].getElementsByTagName('TripDestination')[0].innerHTML + '<br>' + '<span class="label label-info">DEST</span> ';      
                 newRow.insertCell(2).innerHTML = tripsList[j].getElementsByTagName('AdjustedScheduleTime')[0].innerHTML + '<br>' + '<span class="label label-info gps">GPS</span> '; 
//                 var BusType = tripsList[j].getElementsByTagName('BusType')[0].childNodes[0];
             }
             theTable.appendChild(tableNode);
         }
         
     }

    function findStopInfo(xml_list){
        $(xml_list).find('GetRouteSummaryForStopResult').each(function(){
             var stopNum = $(this).find('StopNo').text();
             var stopName = $(this).find('StopDescription').text();
             if( stopName !== null || stopName !== ""){
                 $("#stopName").append('<span class="label label-info stop">' + stopName + '</span>');
             }

        });
    }

    function makeCorsRequest() {
        
        var urlIn = 'https://api.octranspo1.com/v1.2/GetNextTripsForStopAllRoutes?appID=b1adacec&apiKey=49e778e2a464842dbd7df00070b6dd30&stopNo=';
        $("#MainTable").empty();
        $("#stopName span").empty();
        var stopID = $("#stopNumber").val();
        var url = urlIn + stopID;
          var xhr = createCORSRequest('GET', url);
          if (!xhr) {
            alert('CORS not supported');
            return;
          }

          // Response handlers.
          xhr.onload = function() {
            var text = xhr.responseText;
            getBusDetails(text);
           $('#stopNumber').val('');
          };

          xhr.onerror = function() {
            console.log('Woops, there was an error making the request.');
          };

          xhr.send();
    }

    function throwError() {
        $("#stopName").append('<span class="label label-info stop"> Blahh! No Trips Found</span>');
    }

