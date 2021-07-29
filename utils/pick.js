/*
  Picks desired keys from object, and returns a new object.
/*/

exports.pick = (object, keys) => {
    return keys.reduce((obj, key) => {
        if (object && Object.prototype.hasOwnProperty.call(object, key)) {
            let v = object[key];
            if(v)
                obj[key] = object[key];
        }
        return obj;
    }, {});
};

exports.makeQueryString = (object) => {
    let query = "";
    for(let key in object){
        if(key !== "page")
            query += `${key}=${object[key]}&`;
    }
    
    query = query.substr(0,query.length-1);
    return query;
};

