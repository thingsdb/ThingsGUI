// Importing any method from ../Components/Utils leads to webpack error, hence this file.
export const jsonify = (str) => {
    return str.replace(/\w+(?=:)|'/g, function(matched){
        return matched === '\'' ? '"' : `"${matched}"`;
    });
};
