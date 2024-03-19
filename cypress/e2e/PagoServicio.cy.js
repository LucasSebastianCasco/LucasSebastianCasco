import data from '../fixtures/fixtureServicios.json'
describe('Pago de servicio', () => {
    it('Validacion pago de servicio', () => {
        let debID;
        let amount;
        let payID; 
        
            
        cy.request({
            method: "POST",
            url: `${Cypress.env().baseUrlAPI}paymentprocessor/api/Token/GetSSOToken`,
            headers: {
                "x-api-key": Cypress.env().xApiKey,
            },
            body: {
                "Email": Cypress.env().Email
            }
        }).then(response => {
            let access_token = response.body.access_token
            cy.request({
                method: "POST",
                url: `${Cypress.env().baseUrlAPI}api/Services/debts`,
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
                body: {
                    companyCode: data.companyCode,
                    modalityId: data.modalityId,
                    queryData: [{
                        identifierName: data.identifierName,
                        identifierValue: data.identifierValue
                    }]
                }
            }).then(response => {
                expect(response.status).to.be.equal(200);
                debID = response.body.content.debt.debts[0].debtId;
                amount = response.body.content.debt.debts[0].amount;
                console.log(debID, amount);

               
                cy.request({
                    method: "POST",
                    url: `${Cypress.env().baseUrlAPI}api/Services/payment`,
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    },
                    body:
                    {
                        debts:[
                            {
                            debtId: debID,
                            amount: amount,
                            paymentMethod: data.paymentMethod,
                            accountNumber: data.accountNumber
                        }
                    ],
                    payToken: Cypress.env().paytoken
                }
                    
                }).then(paymentResponse => {
                    expect(paymentResponse.status).to.be.equal(200);
                    const paymentID = paymentResponse.body.content.payments[0].id;
                    console.log('log1',paymentID)
                    const query = `select p.id p_id, p.Amount p_ammount, p.UserId p_userID, p.ProviderCreatedAt p_createdAt,
                    pm.Name methodPay ,p.AccountNumber account_number, p.ProviderStatus provider_status from paymentservicedb.dbo.Payments p 
                    INNER JOIN Companies c on p.CompanyId = c.Id
                    INNER JOIN PaymentMethods pm on p.PaymentMethodId = pm.id
                    where p.id=${paymentID}`;
                    console.log(amount)
          
                    cy.task('sqlServer:execute', query).then(result => {
                        expect(result).to.have.length(1);
                        console.log('log2',result)
                        expect(parseInt(result[0][0].value)).to.be.equal(paymentID)
                        expect(result[0][1].value).to.be.equal(amount)
                        expect(result[0][4].value).to.be.equal('Debit')
                        expect(result[0][5].value).to.be.equal(data.accountNumber)
                        //const payID = paymentID
                        console.log('log3',paymentID) 
                        
                        Cypress.env('payID',paymentID)   
                        console.log('log4', payID)
                        cy.request({ 
                            method: "GET",
                            url: `https://broxel-dev.globalta.sk/api/Payments/services/details?paymentId=${Cypress.env('payID')}`,
                            headers: {
                                Authorization: `Bearer ${access_token}`
                            }
                        }).then(paymentDetailResponse =>{
                            expect(paymentDetailResponse.status).to.be.equal(200);
                            expect(paymentDetailResponse.body).not.to.be.empty;
                        })  
                    })
                    
                    
                });
            });
        });

    });
});