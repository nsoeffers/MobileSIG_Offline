require(["jquery", "domain", "uipresenter", "localStorageDao", 
        "webSqlDao", "indexedDbDao", "domReady"], function($, domain, presenter, localStorageDao, webSqlDao, indexedDbDao) {
            
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
    } else if ( daoImpl === "indexedDb") {
        dao = indexedDbDao;
    } else {
        dao = localStorageDao;
    }
    
    presenter.start(dao);
       
});