export type ViewNames = "home" | "table" | "contribute";

export type setPageT = (page: ViewNames) => void;
export type NavigatorArguments = {
    setPage: setPageT;
    activeLinkName: ViewNames;
}

