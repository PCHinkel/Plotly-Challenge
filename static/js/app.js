function unpack(rows, index) {
    return rows.map(function(row) {
      return row[index];
    });
}

function IDSelection() {
    d3.json("samples.json").then(function(data) {
        var names = data.names;
        console.log(names);
        console.log(names[0]);
        for (var i = 0; i < names.length; i++) {
            $('<option value="'+ names[i] +'">' + names[i] + '</option>').appendTo('#selDataset');
            // JQuery portion found here: https://stackoverflow.com/questions/23803303/dynamically-generated-select-option-dropdown-menu-using-javascript
            console.log(names[i]);
        }
    });
}

IDSelection();

function ChartRefresh(id) {
    d3.json("samples.json").then(function(data) {
        for (var i=0; i < data.names.length; i++) {
            if (data.metadata[i]['id'] == id) {
                var patient_id = data.metadata[i]['id']
                var ethnicity = data.metadata[i]['ethnicity']
                var gender = data.metadata[i]['gender']
                var age = data.metadata[i]['age']
                var location = data.metadata[i]['location']
                var bbtype = data.metadata[i]['bbtype']
                var wfreq = data.metadata[i]['wfreq']
            };
        };
        $('#patient-id').text("Patient ID: " + patient_id);
        $('#ethnicity').text("Ethnicity: " + ethnicity);
        $('#gender').text("Gender: " + gender);
        $('#age').text("Age: " + age);
        $('#location').text("Location: " + location);
        $('#bbtype').text("BBType: " + bbtype);
        $('#wfreq').text("WFreq: " + wfreq);

        for (var i=0; i < data.samples.length; i++) {
            if (data.samples[i]['id'] == id) {
                var otu_ids = data.samples[i]['otu_ids'];
                var sample_values = data.samples[i]['sample_values'];
                var otu_labels = data.samples[i]['otu_labels'];
            };
        };

        sliced_ids = otu_ids.slice(0,10);
        for (var i=0; i < sliced_ids.length; i++) {
            sliced_ids[i] = "OTU " + sliced_ids[i];
        };
        sliced_values = sample_values.slice(0,10);
        sliced_labels = otu_labels.slice(0,10);
        sliced_ids.reverse()
        sliced_values.reverse()
        sliced_labels.reverse()

        // Trace1 for the Greek Data
        var trace1 = {
        x: sliced_values,
        y: sliced_ids,
        text: sliced_labels,
        type: "bar",
        orientation: "h"
        };
        // data
        var data = [trace1];
        // Apply the group bar mode to the layout
        var layout = {
        title: "Top OTUs in individual",
        margin: {
            // l: 10,
            // r: 10,
            // t: 10,
            // b: 10
        }
        };
        // Render the plot to the div tag with id "plot"
        Plotly.newPlot("bar", data, layout);

        var trace2 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
              color: otu_ids,
              size: sample_values
            }
        };
          
        var data = [trace2];
          
        Plotly.newPlot("bubble", data);

        var data = [  {
          type: "indicator",
            mode: "gauge+number",
            value: wfreq,
            title: { text: "Belly Button Washings per Week"},
            gauge: {
                axis: { range: [0, 9], tickwidth: 1, tickcolor: "darkblue" },
                bar: { color: "darkblue" },
                bgcolor: "white",
                borderwidth: 1,
                bordercolor: "gray",
                threshold: {
                  line: { color: "red", width: 4 },
                  thickness: 0.75,
                  value: 490
                }
              }
            }
        ];

          
        Plotly.newPlot('gauge', data);

    });
}

ChartRefresh("940");

d3.select('#selDataset')
  .on('change', function() {
    var newID = eval(d3.select(this).property('value'));
    ChartRefresh(newID);
});