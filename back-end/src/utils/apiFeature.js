
export  class ApiFeatures {
    constructor(mongooseQuery, searchQuery) {
        this.mongooseQuery=mongooseQuery
        this.searchQuery=searchQuery
    }

pagination() {
    let pageNumber = this.searchQuery.page *1 || 1
    if(this.searchQuery.page < 0) pageNumber = 1
    const limit = 5 
    let skip = (pageNumber - 1) * limit
    this.pageNumber =pageNumber
    this.mongooseQuery.skip(skip).limit(limit)
        return this
}

filter(){
    let filterObj= structuredClone(this.searchQuery) //? deep copy from req.query 
    filterObj =JSON.stringify(filterObj)
    filterObj=filterObj.replace(/(gt|gte|lt|lte)/g ,val => `$${val}`)
    filterObj=JSON.parse(filterObj)
    let excludedFields= ['page','sort', 'fields','search']
    excludedFields.forEach(val =>{ delete filterObj[val]})
    this.mongooseQuery.find(filterObj)
        return this
}

sort(){
    if(this.searchQuery.sort){
        let sortedBy= this.searchQuery.split(',').join(' ')
        this.mongooseQuery.sort(sortedBy)
    }
    return this
}

fields(){
    if(this.searchQuery.fields){
        let selectedFields= this.searchQuery.fields.split(',').join(' ')
        this.mongooseQuery.select(selectedFields)
    }
    return this
}

search(){
    if(this.searchQuery.search){
        this.mongooseQuery.find(
            {
                $or: [
                    {name:{$regex:req.query.search, $options:'i'}}
                ]
            }
        )
    }
    return this
}

}