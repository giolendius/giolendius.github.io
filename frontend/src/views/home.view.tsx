// import React, {JSX} from 'react';
export function makeHomeView(): HTMLElement {
    const view = document.createElement('div');
    view.className = 'home-view';
    const miohtml = '<h1>Welcome to the Home View</h1>';
    view.innerHTML = `
         <p>This is the main content of the home view.</p>
         <p>fuck off</p>
    ` + miohtml;
    return view;
}
//
// export function HomeView(): JSX.Element {
//     return (
//     <div className="home-view">
//       <h1>Welcome to the Home View</h1>
//       <p>This is the main content of the home view.</p>
//     </div>
//   );
// }
