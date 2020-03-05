import etag from "etag"

const returnCollection = (kind: string, collection: Array<any>, additional?: object): any => {
    let ret: any = {}
    
    ret.kind = kind
    ret.etag = etag(JSON.stringify(collection))

    if (additional !== undefined) {
        ret = Object.assign(ret, additional)
    }

    ret.collection = collection
    
    return ret
}

export { returnCollection }
