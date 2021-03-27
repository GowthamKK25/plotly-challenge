
// create the default function
function init() {
    // select dropdown menu 
    var dropdown = d3.select("#selDataset");
    // read the data 
    d3.json("Data/samples.json").then((data)=> {
        console.log(data)
        // get the id data to the dropdwown menu
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });
        // call the functions to display the data and the plots to the page
        getPlot(data.names[0]);
        getInfo(data.names[0]);
    });
}


// Creating data function
function getPlot(id) {
    // retrive data from json file
    d3.json("Data/samples.json").then((data)=> {
        console.log(data)
  
        var wfreq = data.metadata.map(data => data.wfreq)
        console.log(`Washing Freq: ${wfreq}`)
        
        // filter sample values by id 
        var samples = data.samples.filter(s => s.id.toString() === id)[0]; 
        console.log(samples);
        // Get top 10 
        var samplevalues = samples.sample_values.slice(0, 10).reverse();
        // get top 10 otu ids and reverse it. 
        var OTU_top = (samples.otu_ids.slice(0, 10)).reverse();
        // get the otu id's to correct form
        var OTU_id = OTU_top.map(d => "OTU " + d)
        // get top 10 values for the plot
        var labels = samples.otu_labels.slice(0, 10);
  
        // create trace variable for the plot
        var trace1 = {
            x: samplevalues,
            y: OTU_id,
            text: labels,
            marker: {
            color: 'rgb(142,142,159)'},
            type:"bar",
            orientation: "h",
        };
        // create data
        var data1 = [trace1];
  
        // create layout variable
        var layout1 = {
            title: "Top 10 OTU",
            yaxis:{
                tickmode:"linear",
            },
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 30
            }
        };
  
        // create bar plot
        Plotly.newPlot("bar", data1, layout1);
  
        //console.log(`ID: ${samples.otu_ids}`)
      
        // Bubble chart
        var trace2 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
            size: samples.sample_values,
            color: samples.otu_ids
            },
            text: samples.otu_labels
  
        };
  
        // set the layout 
        var layout2 = {
            xaxis:{title: "OTU ID"},
            height: 600,
            width: 1000
        };
  
        // create data variable 
        var data1 = [trace1];
       
        // create the bubble plot
        Plotly.newPlot("bubble", data1, layout2); 
  
        // The gauge chart
  
        var data3 = [
          {
          domain: { x: [0, 1], y: [0, 1] },
          value: parseFloat(wfreq),
          title: { text: `Weekly Washing Frequency ` },
          type: "indicator",
          
          mode: "gauge+number",
          gauge: { axis: { range: [null, 9] },
                   steps: [
                    { range: [0, 2], color: "yellow" },
                    { range: [2, 4], color: "cyan" },
                    { range: [4, 6], color: "teal" },
                    { range: [6, 8], color: "lime" },
                    { range: [8, 9], color: "green" },
                  ]}
              
          }
        ];
        var layout3 = { 
            width: 700, 
            height: 600, 
            margin: { t: 20, b: 40, l:100, r:100 } 
          };
        Plotly.newPlot("gauge", data3, layout3);
      });
  }  
// create the function to gwr data
function getInfo(id) {
    // read  in the json file
    d3.json("Data/samples.json").then((data)=> {
        // get the metadata for the demographic panel
        var metadata = data.metadata;
        // filter by id
        var result = metadata.filter(meta => meta.id.toString() === id)[0];
        // select demographic panel
        var demographicInfo = d3.select("#sample-metadata");
        // empty the demographic before getting new id info
        demographicInfo.html("");
        // get the necessary demographic data to the panel
        Object.entries(result).forEach((key) => {   
                demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
        });
    });
}

// create the function change event
function optionChanged(id) {
    getPlot(id);
    getInfo(id);
}


init();