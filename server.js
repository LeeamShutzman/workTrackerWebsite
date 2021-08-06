const express = require('express');
const app = express();
const Connection = require('tedious').Connection;
const path = require('path');

function connect(queryString, req, res, processingFunction, fileString) {
    var config = {
        server: 'localhost', //replace with network ip
 //update me
        authentication: {
            type: 'default',
            options: {
                userName: 'appLogin', //update me
                password: 'helloThere'  //update me
            }
        },
        options: {
            port: 1433,
            // If you are on Microsoft Azure, you need encryption:
            database: 'workTracker',  //update me
        }
    };
    var connection = new Connection(config);
    connection.on('connect', function (err) {
        // If no error, then good to proceed.  
        console.log("Connected");
        executeStatement();
    });

    connection.connect();

    var Request = require('tedious').Request;
    var TYPES = require('tedious').TYPES;


    function executeStatement() {
        let sendback = [];
        request = new Request(queryString, function (err) {
            if (err) {
                console.log(err);
            }
        });
        var result = [];
        request.on('row', function (columns) {
            processingFunction(columns, result);
            sendback.push(result);
            result = [];
        });

        request.on('done', function (rowCount, more) {
            console.log(rowCount + ' rows returned');
        });

        // Close the connection after the final event emitted by the request, after the callback passes
        request.on("requestCompleted", function (rowCount, more) {
            let finalArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            if (fileString == 'home.ejs') {

                for (let subArray of sendback) {
                    finalArray[subArray[0] - 1] += subArray[1];
                }

            }else{
                finalArray=[];
                console.log(sendback);
                for(let subArray of sendback){
                    finalArray.push(subArray)
                }
            }
            res.render(fileString, { populateArray: finalArray, year: req.query.year, username: req.query.username, month: req.query.month });
            connection.close();
        });
        connection.execSql(request);
    }
}

function iterateMonths(myCallback) {
    let months = ["January", "Feburary", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    for (month of months) {
        myCallback(month)
    }
}

function monthToNum(month){
    const months = {January: 1, Feburary: 2, March: 3, April: 4, May: 5, June: 6,
    July: 7, August: 8, September: 9, October: 10, November: 11, December: 12};

    return months[month];
}

function indexFunction(columns, result) {
    columns.forEach(function (column) {
        if (column.value === null) {
            console.log('NULL');
        } else {
            let value = column.value;
            if (typeof (column.value) === 'object') {
                value = column.value.getUTCMonth() + 1;
            }
            console.log(value, typeof (value));
            result.push(value);
        }
    });

}


function monthFunction(columns, result) {
    columns.forEach(function (column) {
        if (column.value === null) {
            console.log('NULL');
        } else {
            let value = column.value;
            console.log(value);
            if (typeof (column.value) === 'object') {
                value = (column.value.getUTCMonth() + 1) + "/" + column.value.getUTCDate() + "/" + column.value.getUTCFullYear();
            }
            console.log(value, typeof (value));
            result.push(value);
        }
    });
}

app.use(express.static('public'))

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.get('/s', function (req, res) {
    console.log(req.params);

})

app.get('/month', function (req, res) {
    console.log(monthToNum(req.query.month))
    connect(`select day, hours from days where username = '${req.query.username}' and year(day) = ${req.query.year} and month(day) = ${monthToNum(req.query.month)}`, req, res, monthFunction, 'month.ejs');

})

app.get('/', function (req, res) {
    console.log(req.query);

    /* 
    
    
    */
    connect(`select day, hours from days where username = '${req.query.username}' and year(day) = ${req.query.year} `, req, res, indexFunction, 'home.ejs');


})

app.listen(5000, () => {
    console.log('Im heeeerr');
})