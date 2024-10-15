// Synchronous XMLHttpRequest

function fetchDataSync() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'data/reference.json', false); // Synchronous request
    xhr.send();
    if (xhr.status === 200) {
        const reference = JSON.parse(xhr.responseText);
        const data1File = reference.data_location;
        const data1 = fetchDataSyncHelper('data/' + data1File);

        const data2File = data1.data_location;
        const data2 = fetchDataSyncHelper('data/' + data2File);
        const data3 = fetchDataSyncHelper('data/data3.json');

        processAndDisplayData([data1.data, data2.data, data3.data]);
    }
}

function fetchDataSyncHelper(url) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send();
    if (xhr.status === 200) { 
        return JSON.parse(xhr.responseText);
    }
}

function processAndDisplayData(allData) {
    const tableBody = document.getElementById('data-table').querySelector('tbody');
    tableBody.innerHTML = ''; // clear existing rows

    allData.flat().forEach(item => {
        const [firstName, lastName] = item.name.split(' ');
        const row = `<tr><td>${firstName}</td><td>${lastName}</td><td>${item.id}</td></tr>`;
        tableBody.innerHTML += row;
    });
}

// Asynchronous XMLHttprequest with callbacks

function fetchDataAsync() {
    fetchFile('data/reference.json', function (reference) {
        const data1File = reference.data_location;
        fetchFile('data/' + data1File, function (data1) {
            const data2File = data1.data_location;
            fetchFile('data/' + data2File, function (data2) {
                fetchFile('data/data3.json', function (data3) {
                    processAndDisplayData([data1.data, data2.data, data3.data]);
                });
            });
        });
    });
}

function fetchFile(url, callback) {
    const axhr = new XMLHttpRequest();
    axhr.open('GET', url, true);
    axhr.onload = function () {
        if (this.status === 200) {
            callback(JSON.parse(this.responseText));
        }
    };
    axhr.send();
}

// Fetch with promises
function fetchDataPromise() { 
    fetch('data/reference.json')
        .then(response => response.json())
        .then(reference => {
            return fetch('data/' + reference.data_location);
        })
        .then(response => response.json())
        .then(data1 => {
            return fetch('data/' + data1.data_location).then(response => response.json()).then(data2 => {
                return { data1, data2 };
            });
        })
        .then(({ data1, data2 }) => {
            return fetch('data/data3.json').then(response => response.json()).then(data3 => {
                processAndDisplayData([data1.data, data2.data, data3.data]);
            });
        });
        
    
}