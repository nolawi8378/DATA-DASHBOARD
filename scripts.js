// scripts.js

document.addEventListener('DOMContentLoaded', () => {
    const datasets = {
        salesData: [
            { productName: "Product A", salesAmount: 500, salesDate: "2023-01-01", region: "North" },
            { productName: "Product B", salesAmount: 300, salesDate: "2023-02-01", region: "South" },
            { productName: "Product C", salesAmount: 700, salesDate: "2023-03-01", region: "East" },
            { productName: "Product D", salesAmount: 200, salesDate: "2023-04-01", region: "West" }
        ],
        anotherData: [
            { productName: "Product E", salesAmount: 600, salesDate: "2023-05-01", region: "North" },
            { productName: "Product F", salesAmount: 400, salesDate: "2023-06-01", region: "South" },
            { productName: "Product G", salesAmount: 800, salesDate: "2023-07-01", region: "East" },
            { productName: "Product H", salesAmount: 300, salesDate: "2023-08-01", region: "West" }
        ]
    };

    let currentData = datasets.salesData;
    let sortColumn = '';
    let sortDirection = 'asc';

    function populateTable(data) {
        const tbody = document.querySelector('tbody');
        tbody.innerHTML = '';
        data.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.productName}</td>
                <td>${item.salesAmount}</td>
                <td>${item.salesDate}</td>
                <td>${item.region}</td>
                <td><button class="delete-btn" data-index="${index}">Delete</button></td>
            `;
            row.querySelector('.delete-btn').addEventListener('click', () => deleteData(index));
            row.addEventListener('click', () => showDetails(item));
            tbody.appendChild(row);
        });
    }

    function sortData(data, column) {
        return data.sort((a, b) => {
            if (a[column] < b[column]) return sortDirection === 'asc' ? -1 : 1;
            if (a[column] > b[column]) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }

    function filterData(data) {
        const filterProduct = document.getElementById('filterProduct').value.toLowerCase();
        const filterRegion = document.getElementById('filterRegion').value.toLowerCase();
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const minSales = parseFloat(document.getElementById('minSales').value) || 0;
        const maxSales = parseFloat(document.getElementById('maxSales').value) || Infinity;

        return data.filter(item => {
            return (
                (!filterProduct || item.productName.toLowerCase().includes(filterProduct)) &&
                (!filterRegion || item.region.toLowerCase().includes(filterRegion)) &&
                (!startDate || new Date(item.salesDate) >= new Date(startDate)) &&
                (!endDate || new Date(item.salesDate) <= new Date(endDate)) &&
                (item.salesAmount >= minSales) &&
                (item.salesAmount <= maxSales)
            );
        });
    }

    function showDetails(item) {
        const detailsContent = document.getElementById('detailsContent');
        detailsContent.innerHTML = `
            <h3>${item.productName}</h3>
            <p><strong>Sales Amount:</strong> ${item.salesAmount}</p>
            <p><strong>Sales Date:</strong> ${item.salesDate}</p>
            <p><strong>Region:</strong> ${item.region}</p>
        `;
    }

    function createBarChart(data) {
        const ctx = document.getElementById('barChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.map(item => item.productName),
                datasets: [{
                    label: 'Sales Amount',
                    data: data.map(item => item.salesAmount),
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    function createLineChart(data) {
        const ctx = document.getElementById('lineChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(item => item.salesDate),
                datasets: [{
                    label: 'Sales Amount',
                    data: data.map(item => item.salesAmount),
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    function createPieChart(data) {
        const ctx = document.getElementById('pieChart').getContext('2d');
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: data.map(item => item.productName),
                datasets: [{
                    label: 'Sales Amount',
                    data: data.map(item => item.salesAmount),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)'
                    ],
                    borderWidth: 1
                }]
            }
        });
    }

    function updateCharts(data) {
        // Destroy existing charts before creating new ones to avoid overlapping
        Chart.helpers.each(Chart.instances, function(instance){
            instance.destroy();
        });
        createBarChart(data);
        createLineChart(data);
        createPieChart(data);
    }

    function updateDashboard() {
        let filteredData = filterData(currentData);
        if (sortColumn) {
            filteredData = sortData(filteredData, sortColumn);
        }
        populateTable(filteredData);
        updateCharts(filteredData);
    }

    function exportToCSV(data) {
        const csvRows = [];
        const headers = Object.keys(data[0]);
        csvRows.push(headers.join(','));

        data.forEach(row => {
            const values = headers.map(header => row[header]);
            csvRows.push(values.join(','));
        });

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', 'data.csv');
        a.click();
    }

    document.querySelectorAll('th').forEach(header => {
        header.addEventListener('click', () => {
            const column = header.getAttribute('data-column');
            if (sortColumn === column) {
                sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                sortColumn = column;
                sortDirection = 'asc';
            }
            updateDashboard();
        });
    });

    document.getElementById('applyFilters').addEventListener('click', () => {
        updateDashboard();
    });

    document.getElementById('dataset').addEventListener('change', (event) => {
        currentData = datasets[event.target.value];
        updateDashboard();
    });

    document.getElementById('exportData').addEventListener('click', () => {
        const filteredData = filterData(currentData);
        exportToCSV(filteredData);
    });

    document.getElementById('themeSwitcher').addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
    });

    document.getElementById('dataForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const newProductName = document.getElementById('newProductName').value;
        const newSalesAmount = document.getElementById('newSalesAmount').value;
        const newSalesDate = document.getElementById('newSalesDate').value;
        const newRegion = document.getElementById('newRegion').value;

        const newData = {
            productName: newProductName,
            salesAmount: parseFloat(newSalesAmount),
            salesDate: newSalesDate,
            region: newRegion
        };

        currentData.push(newData);
        updateDashboard();
        document.getElementById('dataForm').reset();
    });

    function deleteData(index) {
        currentData.splice(index, 1);
        updateDashboard();
    }

    updateDashboard();
});
