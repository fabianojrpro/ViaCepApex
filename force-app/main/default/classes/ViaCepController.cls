public with sharing class ViaCepController {
    @AuraEnabled(cacheable=true)
    public static Map<String, Object> getEnderecoPorCep(String cep) {
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint('https://viacep.com.br/ws/' + cep + '/json/');
        request.setMethod('GET');
        HttpResponse response = http.send(request);
        if (response.getStatusCode() == 200) {
            Map<String, Object> address = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
            if (!address.containsKey('erro')) {
                return address;
            }
        }
        return null;
    }

    @AuraEnabled
    public static void salvaHistoricoDePesquisa(String logradouro, String bairro, String cidade, String estado) {
        Historico_de_pesquisa__c historico = new Historico_de_pesquisa__c(
            Logradouro__c = logradouro,
            Bairro__c = bairro,
            Cidade__c = cidade,
            Estado__c = estado
        );
        insert historico;
    }
}