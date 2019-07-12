# Azure Function for migrating mssql data to nosql data
This azure function automatically migrate data from your azure mssql database to azure cosmos database.


Important variables in our code

```
var url = 'mongodb://';  //mongodb or cosmos db url
    
    const ForeignKey = 'AdminUserId' 
    const PrimaryTable = 'Users'            //first table
    const SecondaryTable = 'AdminUserPermissions'   //second table having forign key
    const NewPropertyName = 'Permissions'           // property name for embedded object

```

Configration for mssql server

```
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
    
```
