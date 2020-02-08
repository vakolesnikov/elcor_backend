function generateProductItem(body, images) {
    const {name, indexNumber, type, options: optionValues, optionType, prices, descriptions, _id} = body;


    const options = optionValues.length ? {
        [optionType] : Array.isArray(optionValues) ? optionValues : [optionValues]
    } : null;

    return {
        _id,
        indexNumber,
        name,
        type: Array.isArray(type) ? type : [type],
        options,
        prices: Array.isArray(prices) ? prices: [prices],
        images,
        descriptions: Array.isArray(descriptions) ? descriptions : [descriptions]
    };
}

module.exports = generateProductItem;
