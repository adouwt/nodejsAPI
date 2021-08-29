export const countRate =  (rate) => {
    rate = rate + '';
    let intNumber = parseInt(rate.split('.')[0]);
    let decimalNumber = 0;
    if(rate.split('.')[1]) {
        decimalNumber = parseFloat(0 + '.' + parseFloat(rate.split('.')[1]));
    }
    if(0< decimalNumber  && decimalNumber <= 0.5) {
        decimalNumber = 0.5 
    } else if(0.5 < decimalNumber  && decimalNumber < 1){
        decimalNumber = 1
    }
    return intNumber + decimalNumber
}

   
