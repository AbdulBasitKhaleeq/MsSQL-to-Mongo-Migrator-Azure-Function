var MongoClient = require('mongodb').MongoClient;
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var msSqlConnecter = require("./msSqlCon");




module.exports = async function (context, req) {
    
    var assert = require('assert');
    var ObjectId = require('mongodb').ObjectID;
    var url = ''; // update me
    
    const ForeignKey = 'AdminUserId'
    const PrimaryTable = 'Users'
    const SecondaryTable = 'AdminUserPermissions'
    const NewPropertyName = 'Permissions'
    
    var config =
    {
       authentication: {
           options: {
               userName: '', // update me
               password: '' // update me
           },
           type: 'default'
       },
       server: '', // update me
       options:
       {
           database: 'sqldb', //update me
           encrypt: true
       }
    }
    

    /**
     * Documentation
     * @param {String} Query : sql query for mssql server 
     */
    function GetTableData(Query){
        return new Promise(async (resolve, reject) => {
            var con = new msSqlConnecter.msSqlConnecter(config); 
        con.connect().then(function () { 
            new con.Request(Query) 
                .onComplate(function (count, datas) {                 
                    resolve(datas); 
                }) 
                .onError(function (err) { 
                    console.log(err); 
                }).Run(); 
        }).catch(function (ex) { 
            console.log(ex); 
        }); 
        })
    }
    
    /**
     * Joins one to many relationship to document embedding nosql
     */
    function DataJoin(){
        return new Promise(async (resolve) => { 
            ColumnHeaders = []
            var PrimaryRows = await GetTableData('SELECT * FROM "' + PrimaryTable + '"');
            var SecondaryRows = await GetTableData('SELECT * FROM "'+ SecondaryTable+ '"');
                for ( var property in SecondaryRows[0] ) {
                    if(property != 'Id' & property != ForeignKey){
                        ColumnHeaders.push(' "'+property+'" '); 
                    }            
                };            
            for(var i = 0;i<PrimaryRows.length;i++){            
               
                PrimaryRows[i][NewPropertyName] = await GetTableData('SELECT '+ ColumnHeaders.toString() +' FROM ' + SecondaryTable + ' WHERE '+ ForeignKey +  ' = '+ PrimaryRows[i].Id.toString());
                delete PrimaryRows[i]['Id']
            }
                
            resolve(PrimaryRows)
        })
    }
    
    /**
     * 
     */
    MongoClient.connect(url, (err, client) => {
        
        console.log('Connected to MongoDb');
        
        var db2 = client.db('db1');
    
        db2.collection('myCol', async function (err, collection) {
    
            var Docs  = await DataJoin() 
    
            collection.insertMany(Docs);        
    
        });   
                    
    });
};