const { scenario } = require('ava-codeceptjs')

const SelectProductPage = require('./select-product.page')

const login = async (I, user, password) => {
    await I.amOnPage('https://kundenbereich.check24.de/user/account.html?o=overview')
 
    await I.waitForElement('#login')
    await I.fillField('#login #email', user)
    await I.fillField('#login #password', password)
    await I.waitForElement('#c24-kb-register-btn')
    await I.click('#c24-kb-register-btn')

    // TODO: Would be nice to do something like this
    // const pointsOverlay = await I.grabHTMLFrom('.dialog-box-title.points-with-value')
    // if (pointsOverlay) {
    //     await I.click('.label.c24-form-checkbox-label.points-modal-label')
    //     await I.click('.points_register')
    //     await I.dontSeeElement('.dialog-box-title.points-with-value')
    // }
}

scenario.beforeEach(async t => {
    const { I } = t.context

    await I.resizeWindow(1900, 1024)
    await login(I, 'ava-codeceptjs@gmail.com', 'ava-codeceptjs')
});

const sucheNachDiversenVUsUndErhalteVorschlaege = async (t, resolution) => {
    const { I } = t.context
    const [x, y] = resolution

    await I.resizeWindow(x, y)

    const selectInsuranceCompanyPage = await t.on(SelectProductPage, async I => {
        await I.goThere()
        await I.seeInsuranceProducts()
        return await I.selectProduct('Gesetzliche Krankenversicherung')
    })

    await t.on(selectInsuranceCompanyPage, async I => {
        await I.enter('au') // consider the order
        await I.seeInsurance(['Audi BKK', 'KS/Auxilia', 'BKK Stadt Augsburg', 'Skoda Autoversicherung Direkt'])
        await I.enter('Techniker') // abbrevitations
        await I.seeInsurance(['TK'])
        await I.enter('Hessen') // by typing just one part of the insurance company
        await I.seeInsurance(['AOK Hessen'])
    })
}
sucheNachDiversenVUsUndErhalteVorschlaege.title = (providedTitle, resolution) => `[${resolution[0]}x${resolution[1]}] ${providedTitle}`


scenario('Suche nach diversen VUs und erhalte Vorschlaege', sucheNachDiversenVUsUndErhalteVorschlaege, [1900, 2048]);
scenario('Suche nach diversen VUs und erhalte Vorschlaege', sucheNachDiversenVUsUndErhalteVorschlaege, [320, 568]);

scenario('Suche mit \'techniker\' und erhalte TK', async t => {
    const { I } = t.context

    const selectInsuranceCompanyPage = await t.on(SelectProductPage, async I => {
        await I.goThere()
        await I.seeInsuranceProducts()
        return await I.selectProduct('Gesetzliche Krankenversicherung')
    })

    await t.on(selectInsuranceCompanyPage, async I => {
        await I.seeInsuranceCompanies();
        await I.enter('techniker');
        await I.seeInsurance(['Techniker']);
    })
});

scenario('Setze das Suchfeld zurück', async t => {
    const { I } = t.context

    const selectInsuranceCompanyPage = await t.on(SelectProductPage, async I => {
        await I.goThere()
        await I.seeInsuranceProducts()
        return await I.selectProduct('Gesetzliche Krankenversicherung')
    })

    await t.on(selectInsuranceCompanyPage, async I => {
        await I.seeInsuranceCompanies();
        await I.enter('techniker');
        await I.resetSearch();
        await I.showsEmptySearchField();
    })
});

