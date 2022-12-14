//stores data, changes with drop down list selection
function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata= data.metadata;
      var resultsarray= metadata.filter(sampleobject => sampleobject.id == sample);
      var result= resultsarray[0];
      var wfreq = result.wfreq;
      console.log(wfreq);
      var panel = d3.select("#sample-metadata");
      panel.html("");
      Object.entries(result).forEach(([key, value]) => {
        panel.append("h6").text(`${key}: ${value}`);
      });

      //create gauge chart here so that it takes the wfreq from this result
      var data = [
        {
          type: "indicator",
          mode: "gauge+number",
          value: wfreq,
        
          gauge: {
            axis: { range: [null, 9], ticks: 9},
            steps: [
              { range: [0, 1], color: "#e7fdeb"},
              { range: [1, 2], color: "#d1fbd8"},
              { range: [2, 3], color: "#a3ee5b"},
              { range: [3, 4], color: "#75DB66"},
              { range: [4, 5], color: "#66d855"},
              { range: [5, 6], color: "#53C027"},
              { range: [6, 7], color: "#40ba0f"},
              { range: [7, 8], color: "#2F8F19"},
              { range: [8, 9], color: "#188300"}
            ],
            threshold: {
              line: { color: "red", width: 3 },
              thickness: 0.75,
              value: wfreq

            }
          }
        }
      ];
      
      var gaugelayout = {
        title: "Belly Button Washing Frequency <br> Scrubs per Week",
        margin:  { t: 10, b: 0 },
        width: 600, 
        height: 450
    };
      Plotly.newPlot('gauge', data, gaugelayout);
  
  
  
    });
  };


  
function buildCharts(sample) {
  
  // getting our data from our json file
  d3.json("samples.json").then((data) => {
    var samples= data.samples;
    var resultsarray= samples.filter(sampleobject => sampleobject.id == sample);
    var result= resultsarray[0]
    //gets the bacteria ids, bacteria names and values from our result array
    var OTUIds = result.otu_ids;
    var OTUNames = result.otu_labels;
    var OTUValues = result.sample_values;
  
    //creating bubbleplot
    var LayoutBubble = {
      margin: { t: 0 },
      xaxis: { title: "OTU ID" },
      hovermode: "closest",
      };
      //putting data into our bubble plot, x value is bacteria ids and y is how much of that bacteria is present
      var DataBubble = [ 
      {
        x: OTUIds,
        y: OTUValues,
        text: OTUNames,
        mode: "markers",
        marker: {
          color: OTUIds,
          size: OTUValues,
          }
      }
    ];
  
    Plotly.newPlot("bubble", DataBubble, LayoutBubble);
   
    var bar_data =[
      {
        // selects the top 10 OTUs by slicing in reverse order
        y:OTUIds.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
        x:OTUValues.slice(0,10).reverse(),
        text:OTUNames.slice(0,10).reverse(),
        type:"bar",
        orientation:"h"
  
      }
    ];
  
    var barLayout = {
      title: "Top 10 OTUs Found",
      margin: { t: 30, l: 150 }
    };
  
    Plotly.newPlot("bar", bar_data, barLayout);

  });
  
  
  }; 

  
   
  
function init() {
  // selects element
  var selector = d3.select("#selDataset");
  
  // putting the ids into the drop down list
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector.append("option").text(sample).property("value", sample);
    });
  
    // creates first sample when user opens the webpage
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
  };
  
function optionChanged(newSample) {
  // if user selects a new ID, get new data
  buildCharts(newSample);
  buildMetadata(newSample);
  };
  
  
  
  // Initialize the dashboard
init();
