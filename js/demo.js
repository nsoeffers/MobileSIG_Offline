require(["jquery", "domain", "uipresenter", "localStorageDao", 
        "webSqlDao", "domReady"], function($, domain, presenter, localStorageDao, webSqlDao) {
            
    "use strict";
    
    var dao;
    var daoImpl = (window.location 
                    && window.location.hash 
                    && window.location.hash.length > 0)? 
                        window.location.hash.substring(1) : "localStorage";
    if ( daoImpl === "localStorage") {
        dao = localStorageDao;
    } else if ( daoImpl === "webSql") {
        dao = webSqlDao;
    } else {
        dao = localStorageDao;
    }
    
    presenter.start(dao);
       
});