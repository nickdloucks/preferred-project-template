/**
 * A cash-till function for processing transactions with cash. It calculates how much money
 * (and what type) will be given to the customer if change is due. This program assumes that
 * <cid> param will provide ["$TYPE", 0.0] for any empty slots in the till, and slots will be
 * sorted in ascending order by its unit value.
 * @param {number} price : cost of goods to customer
 * @param {number} cash : cash given by customer to pay for goods
 * @param {2-D array} cid : "cash-in-drawer"; specified ammounts for each type of bill/coin
 * @returns {object} tillState : the state of the drawer;
 *      i.e. whether it is open for more business, and the ammount/type of money
 *      given as change. NOTE: The change given will only include units where the total value for the unit
 *      given to the customer is > 0. For example, ["$TYPE", 0.0] will not appear in the return value.
 */

interface TillStatus {
  status: string, // till status: open, closed, or error
  change: Array<Array<string | number>> | null, // 2-dimensional array with string and number types. Or null
  message?: string // optional error message if input is not given in valid USD increments
}

export default function checkCashRegister(price: number, cash: number, cid: Array<Array<string | number>>): TillStatus {
  price = precise(price); // Unsure money params are w/ in desired precision
  cash = precise(cash); // See hoisted function <precise()> below the <MONEY> constant

  let $stillDue = cash - price; // Init. variable: amount of money the customer is still owed
  let changePile: Array<Array<string | number>> = []; // itemized breakdown of change to be given to the customer
  // ========= STANDARD DATA NEEDED ====
  const MONEY = [
    // money value data stored in array so the recursive function can process it in order of value
    ['PENNY', 0.01],
    ['NICKEL', 0.05],
    ['DIME', 0.1],
    ['QUARTER', 0.25],
    ['ONE', 1.0],
    ['FIVE', 5.0],
    ['TEN', 10.0],
    ['TWENTY', 20.0],
    ['ONE HUNDRED', 100.0],
  ]; // The MONEY array represents the value of one instance of a given bill or coin

  function precise(decimal: number): number {
    return Math.round(100 * decimal) / 100; // All money values should be given to the nearest hundredth
    // This function helps since Javascript is not as prcise with decimal numbers as other lanaguages like Python.
  }

  //// Till COUNTING SUBROUTINE:
  function tillCount(arr2D: Array<Array<string | number>>) {
    let counter: number = 0;
    for (let i = 0; i < arr2D.length; i++) {
      counter += arr2D[i][1] as number;
    }
    counter = precise(counter);
    return counter;
  }
  let totalTill = tillCount(cid); // represents the total money value in the till


  //==== MAIN BODY OF ALGORITHM ============
  if (totalTill < $stillDue) { // Not enough money left in the till to make change for this cash amount.
    return { status: 'INSUFFICIENT_FUNDS', change: [] };
  } else if (totalTill === $stillDue) {
    // customer is owed the exact ammount of change in the till
    // give customer all the change and close out the till
    return { status: 'CLOSED', change: cid };
  } else { // when totalTill > $stillDue
    ////////////////////////////////////////////////////////////////////////////////////
    function recurseCount(owed_$: number = $stillDue, index_$: number): void {
      if (owed_$ === 0 || index_$ < 0) {  // Stop recursion if no more money is owed,
        return; // or there are no more types/units of money that could be given out for the remainder.
      }
      
      let slotVal: number = cid[index_$][1] as number; // alias for total value of the money in the current bill/coin slot
      let unitVal: number = MONEY[index_$][1] as number; // alias for unit value of current bill/coin

      if (slotVal == 0 || owed_$ < unitVal) {
        // no $ in current slot, or the current denomination/unit size is too big to give out
        recurseCount(owed_$, index_$ - 1); // move on to next-biggest money slot
        return;
      }

      let type_$ = MONEY[index_$][0]; // alias for name of current bill/coin (not needed if current slot is being skipped using subroutine directly above)

      // 1 EXACT UNIT-POP SUBROUTINE:
      if (owed_$ == unitVal) { // the ammount stillowed$ is equal to the unit value of the current bill/coin
        changePile.push([type_$, owed_$]); // add the $ name and value to the change pile to be given to customer
        (cid[index_$][1] as number) -= owed_$; // remove from till
        return;
      } else if (owed_$ > unitVal) {
        // ITERATIVE UNIT-POP SUBROUTINE:

        let remainder = owed_$ % unitVal; // change still due that cannot be fulfilled from the current slot
        let maxFromSlot = owed_$ - remainder; // max possible value of $ to be given from this slot (example: how much change in $1 bills if 1.00 is the current unitVal)

        let unitCount = 0;
        while ((unitCount < slotVal / unitVal) && (unitCount < maxFromSlot / unitVal)) {
          unitCount += 1; // Count how many instances of the current bill you can give out
        }

        let giveFromSlot = unitCount * unitVal;

        changePile.push([type_$, giveFromSlot]); // add the change to the pile to be given to the customer
        (cid[index_$][1] as number) -= giveFromSlot; // remove $ from till
        remainder += maxFromSlot - giveFromSlot; // if there wasn't enough in the slot to give out the maximum possible,
        // then add the difference to the remainder and recurse on the remainder

        $stillDue = remainder; // BUG SQUASHED! recursing on the remainder w/o first mutating $stillDue inadvertently decoupled the process from 
        // what was actually still owed to the customer, thus the program would never think it had given out enough change.
        // setting $stillDue equal to <remainder> fixes that.
        $stillDue = precise($stillDue); // keep the decimal numbers precise

        recurseCount($stillDue, index_$ - 1);
        return;
      }
      return;
    }
    recurseCount($stillDue, 8);
    ///////////////////////////////////////
  }
  if ($stillDue > 0.0001) {
    // At this point, exact change cannot be given:
    // any bills or coins remaining in the till will be bigger than the amount due to the customer.
    return { status: 'INSUFFICIENT_FUNDS', change: [] };
  } else {
    // At this point, the exact amount of change is given to the customer and the till is ready for the next transaction
    return { status: 'OPEN', change: changePile };
  }
}

// checkCashRegister(19.5, 20, [
//   ['PENNY', 1.01],
//   ['NICKEL', 2.05],
//   ['DIME', 3.1],
//   ['QUARTER', 4.25],
//   ['ONE', 90],
//   ['FIVE', 55],
//   ['TEN', 20],
//   ['TWENTY', 60],
//   ['ONE HUNDRED', 100],
// ]);
