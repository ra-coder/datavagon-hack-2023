const pushHistory = (title: string) => {
    window.history.pushState(null, '', `/${title}`);
}

export { pushHistory };
