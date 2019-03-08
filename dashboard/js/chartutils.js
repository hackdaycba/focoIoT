function get_color () {
    var index = Math.floor(Math.random() * colors.length)
    color = colors[index]
    var index = colors.indexOf(color)
    if (index > -1) {
        colors.splice(index, 1)
    }
    return color
}

function updateData(chart,input, x, y) {

    if (chart.data.labels.indexOf(x) < 0) {
        chart.data.labels.push(x)
        if (chart.dataQty >= chart.dataLength) {
            removeData(chart)
        }
        chart.dataQty++
        console.log("dataqty " + chart.dataQty)
    }
    index = findObjectIndexByKey(chart.data.datasets, "label", input)

    if (typeof(chart.data.datasets[index]) != 'undefined') {
        chart.data.datasets[index].data.push(y)
        chart.update()
    }


}

function addData(chart, label, data) {
    if (dataQty >= dataLength) {
        removeData(chart)
    }
    dataQty++
    console.log("dataqty " + dataQty)
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();

}

function removeData(chart) {
    console.log(chart.data.labels[0])
    chart.data.labels.shift();
    chart.data.datasets.forEach((dataset) => {
        console.log(dataset.data[0])
        dataset.data.shift();
    });
    chart.update();
}


function findObjectIndexByKey(array, key, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
            console.log("index obj: "+i)
            return i
        }
    }
    return null;
}
