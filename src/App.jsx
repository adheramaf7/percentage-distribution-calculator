import { useMemo, useReducer } from 'react';

const ACTION_TYPE = {
   changeTotalValue: 'change_total_value',
   addDistribution: 'add_distribution',
   changeDistributionPercentage: 'change_distribution_percentage',
   removeDistribution: 'remove_distribution',
   reset: 'reset',
};

function reducer(state, action) {
   switch (action.type) {
      case ACTION_TYPE.changeTotalValue:
         return { ...state, totalValue: action.value };

      case ACTION_TYPE.addDistribution: {
         const totalDistributions = state.distributions.reduce((a, b) => a + parseInt(b), 0);
         const newDistribution = totalDistributions > 100 ? 0 : 100 - totalDistributions;
         return { ...state, distributions: [...state.distributions, newDistribution] };
      }

      case ACTION_TYPE.reset:
         return {
            totalValue: '',
            distributions: [100],
         };

      case ACTION_TYPE.changeDistributionPercentage: {
         const { index, newValue } = action;
         const newDistributions = [...state.distributions];

         newDistributions[index] = newValue;

         return {
            ...state,
            distributions: newDistributions,
         };
      }

      case ACTION_TYPE.removeDistribution: {
         const { index } = action;
         const newDistributions = [...state.distributions];

         newDistributions.splice(index, 1);

         return {
            ...state,
            distributions: newDistributions,
         };
      }

      default:
         return state;
   }
}

function App() {
   const [state, dispatch] = useReducer(reducer, {
      totalValue: '',
      distributions: [100],
   });

   const totalDistribution = useMemo(() => {
      return state.distributions.reduce((a, b) => a + parseInt(b), 0);
   }, [state.distributions]);

   //  const formattedTotalValue = useMemo(() => {
   //     return state.totalValue ? Intl.NumberFormat('id').format(state.totalValue) : '';
   //  }, [state.totalValue]);

   const calculateValuePercentage = (value, percentage) => {
      return (value * percentage) / 100;
   };

   const handleTotalValueChange = (e) => {
      dispatch({ type: ACTION_TYPE.changeTotalValue, value: e.target.value });
   };

   const handleDistributionChange = (index, newValue) => {
      dispatch({ type: ACTION_TYPE.changeDistributionPercentage, index, newValue });
   };

   const handleResetClick = (e) => {
      e.preventDefault();
      dispatch({ type: ACTION_TYPE.reset });
   };

   const handleAddClick = (e) => {
      e.preventDefault();
      dispatch({ type: ACTION_TYPE.addDistribution });
   };

   const handleRemoveDistribution = (index) => {
      dispatch({ type: ACTION_TYPE.removeDistribution, index });
   };

   return (
      <div className="h-screen bg-gray-100 flex flex-col justify-center items-center">
         <div className="bg-white max-w-lg w-full py-4 px-6 shadow-md rounded-md space-y-4">
            <section className="text-center space-y-1">
               <h1 className="font-semibold text-lg">Value Distribution Calculator</h1>
               <p className="text-center text-sm text-gray-500">
                  Calculate distributions of a value.
               </p>
            </section>
            <section className="flex flex-row gap-x-2">
               <input
                  type="number"
                  min={1}
                  value={state.totalValue}
                  onChange={handleTotalValueChange}
                  className="flex-1 ring-1 border-0  ring-gray-300 focus:ring-2 focus:ring-blue-500 p-2 rounded-md placeholder:text-gray-400"
                  placeholder="Enter some value here..."
               />
               <button
                  type="button"
                  onClick={handleResetClick}
                  className="bg-red-500 text-white font-semibold rounded-md px-6 hover:bg-red-400">
                  Reset
               </button>
            </section>
            {state.totalValue && (
               <section className="flex flex-col gap-y-3">
                  <div className="flex flex-row justify-between">
                     <p className="font-semibold">Distributions</p>
                     <button
                        className="text-sm text-blue-500 font-semibold"
                        type="button"
                        onClick={handleAddClick}>
                        (+) Distribution
                     </button>
                  </div>
                  <ul className="flex flex-col gap-y-2">
                     {state.distributions.map((distribution, index) => (
                        <li
                           className="flex flex-row justify-between items-center gap-2"
                           key={index}>
                           <div className="flex flex-row space-x-4 flex-1">
                              <div className="relative">
                                 <input
                                    type="number"
                                    min={1}
                                    value={distribution}
                                    onChange={(e) =>
                                       handleDistributionChange(index, e.target.value)
                                    }
                                    className="block w-full ring-1 border-0 text-sm ring-gray-300 focus:ring-2 focus:ring-blue-500 p-2 rounded-md placeholder:text-gray-400"
                                    placeholder={`Percentage #${index + 1}`}
                                 />
                                 <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-7">
                                    <span className="text-gray-500 sm:text-sm">%</span>
                                 </div>
                              </div>
                              {state.distributions.length > 1 && (
                                 <button
                                    className="text-red-500 font-semibold"
                                    type="button"
                                    onClick={() => handleRemoveDistribution(index)}>
                                    X
                                 </button>
                              )}
                           </div>
                           <div className="text-right font-semibold">
                              {Intl.NumberFormat('id').format(
                                 calculateValuePercentage(state.totalValue, distribution)
                              )}
                           </div>
                        </li>
                     ))}
                  </ul>
                  <p
                     className={
                        'font-semibold ' +
                        (totalDistribution > 100 ? 'text-red-500' : 'text-gray-600')
                     }>
                     Total Distribution Percentage: {totalDistribution}%
                  </p>
               </section>
            )}
         </div>
      </div>
   );
}

export default App;
