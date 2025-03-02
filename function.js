function calculateChange(initialDenominations, paidAmount, totalCost) {
    let change = paidAmount - totalCost;
  
    // Denominations from largest to smallest
    const availableDenominations = [500, 100, 50, 20];
    
    let changeGiven = {};
  
    // Initialize changeGiven with zero for each denomination
    availableDenominations.forEach(denom => {
      changeGiven[denom] = 0;
    });
  
    // Go through each denomination and calculate how much of it we can give as change
    for (let i = 0; i < availableDenominations.length; i++) {
      let denom = availableDenominations[i];
  
      // Determine how many notes/coins of this denomination we can give
      let count = Math.min(Math.floor(change / denom), initialDenominations[denom]);
  
      // Deduct the amount from the change and update the initial denomination
      change -= count * denom;
      changeGiven[denom] = count;
      initialDenominations[denom] -= count;
  
      // If the change has been fully given, break out of the loop
      if (change === 0) break;
    }
  
    // Check if we could give the full change
    if (change > 0) {
      return { error: "Insufficient denominations to give full change" };
    }
  
    return {
      changeGiven,
      remainingDenominations: initialDenominations,
    };
  }
  
  // Example usage:
  let initialDenominations = {
    500: 5,
    100: 4,
    50: 2,
    20: 2,
  };
  
  let paidAmount = 1000;
  let totalCost = 330;
  
  let result = calculateChange(initialDenominations, paidAmount, totalCost);
  
  console.log("Change Given:", result.changeGiven);
  console.log("Remaining Denominations:", result.remainingDenominations);