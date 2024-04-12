import { LightningElement, track } from 'lwc';
import getEnderecoPorCep from '@salesforce/apex/ViaCepController.getEnderecoPorCep';
import salvaHistoricoDePesquisa from '@salesforce/apex/ViaCepController.salvaHistoricoDePesquisa';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class TelaViaCep extends LightningElement {
    @track cep = '';
    @track address;

    handleCepChange(event) {
        this.cep = event.target.value;
    }

    handleSearch() {
        getEnderecoPorCep({ cep: this.cep })
            .then(result => {
                if(result) {
                    this.address = result;
                    this.salvarHistorico(result);
                } else {
                    this.address = null;
                    this.showError('CEP não encontrado.');
                }
            })
            .catch(error => {
                this.showError('Erro ao buscar o CEP.');
                this.address = null;
            });
    }

    salvarHistorico(address) {
        salvaHistoricoDePesquisa({ 
            logradouro: address.logradouro, 
            bairro: address.bairro, 
            cidade: address.localidade, 
            estado: address.uf 
        }).catch(error => {
            this.showError('Erro ao salvar o histórico de busca.');
        });
    }

    showError(message) {
        this.dispatchEvent(new ShowToastEvent({
            title: 'Erro',
            message: message,
            variant: 'error',
            mode: 'dismissable'
        }));
    }
}