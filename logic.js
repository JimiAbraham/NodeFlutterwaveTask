var finalApiResponse = {
    "ID": 1308,
    "Balance": 0,
    SplitBreakdown: [],

}


const main = (apiData) => {

    //console.log(apiData.SplitInfo); // confirmed that we got our data from API->server->logic


    compute(apiData.SplitInfo, apiData.Amount) //created and call a compute function that takes 2 parameters, the splitInfo array and the amount, here we will do the iteration and run the balance and calculation.

    function compute(arr, total) {

        let runningBalance = total //the total balance which will be reducing after each split.

        var splitBreakdown = []; // from each split, we will push the amount and splitId in here.

        var totalRatioValue = 0; // RATIO calculation requires same opening balance for each ratio-split-value and deduct from running balance, therefore we can wrap up all the split-value and deduct from running balance...so we initilize this variable, makes more sense when looping ratio values.

        // when calculating for RATIO, we have to know the total number of ratio split as well as a sum of all the ratio values  

        var ratioSum = 0;

        for (var i = 0; i < arr.length; i++) {

            if (arr[i].SplitType == "RATIO") {

                ratioSum += arr[i].SplitValue;

            }
        }
        // end of when calculating for RATIO, we have to know the total number of ratio split as well as a sum of all the ratio values 


        sortSplitType(arr);


        for (i = 0; i < arr.length; i++) {

            switch (arr[i].SplitType) {
                case "FLAT":
                    runningBalance -= arr[i].SplitValue;

                    var arrayData = { Amount: arr[i].SplitValue, SplitEntityId: arr[i].SplitEntityId }

                    splitBreakdown.push(arrayData);


                    break;
                case "PERCENTAGE":
                    var percentageValue = (arr[i].SplitValue) / 100 * runningBalance

                    runningBalance -= percentageValue;

                    var arrayData = { Amount: percentageValue, SplitEntityId: arr[i].SplitEntityId };

                    break;
                case "RATIO":

                    var RatioValue = arr[i].SplitValue / ratioSum * runningBalance;

                    totalRatioValue = totalRatioValue + RatioValue;

                    var arrayData = { Amount: RatioValue, SplitEntityId: arr[i].SplitEntityId };

                    splitBreakdown.push(arrayData);

                default:

                    var arrayData = { Amount: 0, SplitEntityId: 'Invalid Split type' };


            }

        }

        runningBalance -= totalRatioValue; // Based on the RATIO calculation, we did the final deduction here so as to get an updated value of running balance, make reference to line line 22.

        finalApiResponse.SplitBreakdown = splitBreakdown; // replace the final response splitdown with the one we have been pushing locally within the function.


        finalApiResponse.Balance = runningBalance;



    }



    function sortSplitType(arr) {

        arr.sort(function(a, b) {
            let x = a.SplitType.toLowerCase();
            let y = b.SplitType.toLowerCase();
            if (x < y) { return -1; }
            if (x > y) { return 1; }
            return 0;
        });

        return arr

    }

    //console.log(sortSplitType(apiData.SplitInfo));// the array sorting in the order of FLAT, PERCENTAGE and RATIO was suucessful

}


module.exports = { main, finalApiResponse }