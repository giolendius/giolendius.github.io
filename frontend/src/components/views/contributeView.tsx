import React, {useRef} from "react";
import {BUILD_DATE} from "../utils/build-date"

export default function ContributeView({children}: { children: React.ReactNode }) {
    return <>
        {children}
        <MyCoolStuff/>
        <GoooleSheet/>
        <GitHub/>
        <Spunti/>
    </>;
}

function MyCoolStuff() {
    const [sidebarOpen, setSidebarOpen] = React.useState(true);
    //   React.useEffect(() => {
    //   document.body.style.overflow = sidebarOpen ? "hidden" : "auto";
    // }, [sidebarOpen]);

    return (
        <div className="takes-all-screen tuttorosso"><div className='bg-green-200 sticky top-0 z-3'>
            <button onClick={() => setSidebarOpen(!sidebarOpen)}>
                    Close sidebar
                </button></div>
            {/* MAIN CONTENT (always there) */}
            <main className={`main ${sidebarOpen ? "locked" : ""}`}>
                <h1>Main Content</h1>
                <p>This content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more text
                his content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more textThis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more text
                his content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more textThis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more text
                his content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more textThis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more text
                his content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more textThis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more text
                his content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more textThis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more text
                his content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more textThis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more text
                his content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more texthis content was always here. adokladkamw and here there
                is a lot of text write more text This content was always here. adokladkamw and here there is a lot of text
                write more text</p>
            </main>

            {/* SIDEBAR (on top) */}
            <aside className={`my-sidebar  ${sidebarOpen ? "open" : "closed"}`}>
                <h2>Sidebar</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium ad architecto ipsa iste, iure,
                    laboriosam libero minima molestias omnis quas rerum saepe sit, temporibus? Aut consequuntur earum
                    eligendi id minus tenetur totam vel. Ab consequuntur, explicabo fugit necessitatibus nesciunt unde
                    vel velit vitae? Accusamus aliquam aliquid cum dicta dolore enim facere facilis incidunt laborum
                    libero nostrum numquam obcaecati odio perspiciatis praesentium, quo, repudiandae sunt suscipit
                    tempora ut veniam vero voluptas voluptatum? Assumenda autem distinctio expedita laborum non tempore
                    temporibus vel. A alias debitis deserunt doloremque ea fugiat impedit ipsam laboriosam nostrum optio
                    pariatur, praesentium sequi sit suscipit voluptatem? Accusantium aliquid amet beatae consequuntur,
                    dignissimos doloremque eaque eos excepturi exercitationem fugiat laborum modi natus provident
                    repellat repudiandae! Ab ad alias aspernatur consequatur culpa earum ex excepturi laboriosam,
                    molestiae necessitatibus nemo optio placeat quasi quidem repellat unde veniam! Ab distinctio nostrum
                    ut. Adipisci commodi dolor doloribus enim est iste libero nostrum quis, repellendus? Accusamus, at
                    commodi consequuntur deleniti, dignissimos distinctio dolorem ex exercitationem facilis fugiat illum
                    maiores minima nesciunt nisi odio odit quaerat, qui quis quo ratione repellendus rerum saepe sed
                    similique sint sit suscipit ut vel vero voluptatem. Ab accusamus assumenda atque corporis dolor
                    doloremque ea earum illo impedit, ipsum laborum maiores maxime odio odit praesentium provident
                    quaerat quas, quo repudiandae temporibus ullam veniam vitae voluptatibus. Aut delectus ea excepturi
                    numquam quis. Amet culpa dolores doloribus dolorum eaque eius fugiat inventore itaque laborum
                    molestias, neque, non odio quis reiciendis repellat temporibus tenetur voluptatem voluptates! Animi
                    assumenda beatae consequatur cumque, deserunt doloribus eligendi esse eveniet ex explicabo fugiat
                    incidunt magnam nulla possimus qui ratione reiciendis sit soluta temporibus vitae. Accusantium,
                    culpa deleniti distinctio libero necessitatibus, nisi non odit omnis provident quos sit vitae.
                    Aliquam asperiores aspernatur corporis dolore dolorem ea earum eius enim error eum exercitationem
                    explicabo impedit in incidunt inventore libero nesciunt pariatur perspiciatis praesentium quam quas
                    qui, quo quos repellat reprehenderit rerum sapiente tenetur vel voluptate voluptatibus. Ab animi id
                    mollitia neque praesentium quae voluptate. A commodi consequatur consequuntur delectus deleniti
                    deserunt dignissimos distinctio dolor dolorem doloribus ea earum eligendi illo illum iste labore
                    odio porro, quae quia repellendus repudiandae velit voluptatibus! Blanditiis consequatur cum,
                    deserunt eaque earum error, et eveniet fuga id iusto laboriosam molestiae nobis provident quo quod
                    repellendus temporibus veritatis. A corporis dolore ea eaque, labore, minus nemo nisi officiis
                    perferendis quas rem repellat sequi! Ab debitis iste minima officiis quae similique temporibus.
                    Aliquid at autem dolorum eius explicabo in ipsum iure omnis optio, praesentium quis repellendus
                    rerum temporibus ullam voluptate? Accusamus ad alias consequatur culpa delectus dolor doloribus,
                    enim facilis illum laboriosam laborum, nesciunt nobis quae quod ratione, reprehenderit soluta
                    suscipit totam veniam vero? Maiores quo sunt tenetur. Accusamus aliquid enim error esse iure
                    repellat, repellendus? Distinctio ipsa nemo quidem, sequi sit voluptate. Aliquam amet aut doloremque
                    et explicabo hic impedit magnam maxime obcaecati pariatur! Ab amet atque eius fugit harum impedit
                    iste magni pariatur, porro quis rem temporibus vero. Architecto assumenda beatae deserunt doloremque
                    dolorum earum eos, necessitatibus obcaecati, omnis pariatur porro reprehenderit sequi voluptas!
                </p>

            </aside>
        </div>
    );
}

function GoooleSheet() {
    return <section className="h-1vh my-flex-wrap greenD mb-lg-5">
        <div className="m-10">
            <div className="didascalia-immagine">
                <h2 className="m-6">Manca un gioco?</h2>
                <p>Pensi che un gioco non sia nella lista?</p>
                <p>Accedi al foglio di
                    Google Sheets per inserirne i dati nella tabella e averlo instantaneamente qui.</p>
                <div className="flex-o-center">
                    <a target="_blank"
                       href="https://docs.google.com/spreadsheets/d/1RnaUmV5fSHc3oyIf62DhY3m21oLaS6xh2ss3KcMzKn8/edit?gid=1973594395#gid=1973594395">
                        <div className="border m-4 p-4 relative nav-link rounded-lg">Google Sheet</div>
                    </a>
                </div>
                <p> Inserisci almeno le informazioni essenziali come nome e giocatori minimi e massimi</p>
            </div>
        </div>
        <div className="m-10 flex-o-center h-full overflow-hidden">
            <img className='fittare' alt="Punto di Domanda"
                 src="https://img.freepik.com/premium-photo/close-up-green-plant-against-white-background_1048944-1056718.jpg?w=826"/>
        </div>
    </section>
}

function GitHub() {
    const referenza = useRef<HTMLDivElement | null>(null);
    return <section className="h-vh-2 flex-o-center greenDD">
        <div ref={referenza}>
            <h2>Guarda il codice!</h2>
            <p>Vuoi vedere il codice sorgente di questo sito? Trovi il codice su github:</p>
            <div className="flex-o-center relative">
                <a target="_blank" rel="noopener noreferrer"
                   href="https://github.com/giolendius/giolendius.github.io">
                    <div className="enlarge border m-4 p-4 relative nav-link rounded-lg">Repository</div>
                </a>
            </div>
            <p>Accedi alla pagina e visualizza il codice sul branch main!</p>
            {/*<p>*/}
            {/*    <button onClick={() => {*/}
            {/*        referenza.current?.scrollIntoView()*/}
            {/*    }}>Ciaooo*/}
            {/*    </button>*/}
            {/*</p>*/}
        </div>
    </section>
}


function Spunti() {
    return <>
        <section className="h-vh-2 flex-o-center bg-black">
            <div>
                <h3>Suggerimenti su futuri miglioramenti</h3>
                <p>Ricerca avanzata: tipologie, autori...</p>
                <p>Pagina con visuale dettagliata del gioco</p>
                <p> Sviluppare le espansioni</p>
            </div>
            <div>
                <h3>Ultimi aggiornamenti</h3>
                <p>Game DB: 2024-12-22</p>
                <p>Site layout: {BUILD_DATE}</p>
            </div>

        </section>
    </>
}