<h1 align="center">
  <img alt="KenzieHub" title="KenzieHub" src="https://ayty.org/assets/img/projetos/phoebus.png" width="100px" />
</h1>

<h1 align="center">
  Centros Comunitários - API
</h1>

<p>
Este é o backend da aplicação Centros Comunitários - Uma solução para facilitar a comunicação entre centro comunitários que estejam disponíveis para abrigar pessoas em situações de calamidade, bem como, o intercâmbio de recursos visando atender as necessidades das pessoas que se encontram abrigadas. 
</p>

## **Endpoints**

A API tem 12 endpoints listados, sendo possível realizar CRUD de centros comunitários, realizar intercâmbio entre centros comunitários, listar histórico de intercâmbio entre centros, listar centros com ocupação maior que 90% da sua capacidade, calcular a média de recursos presentes em todos os centros, listar recursos, etc.
<br/>
<br/>

<strong>A url base da API é http://localhost:8000</strong>
<br/>
<br/>

## **Endpoint - Community Center**

<hr/>
<br/>

<h2> Listando centros comunitários </h2>

`GET /communitycenter - FORMATO DA REQUISIÇÃO`

Essa requisição irá retornar todos os centros comunitários cadastrados.

<br/>

```json
[
  {
    "_id": "66ad6c5682b9e799fe9d1507",
    "name": "Teste Center 1",
    "address": "example",
    "localization": "example",
    "maxNumberPeople": 20,
    "quantityPeopleOccupation": 18,
    "resource": [
      {
        "item": "Kit de suprimentos médicos",
        "quantity": 99
      },
      {
        "item": "Médico",
        "quantity": 99
      },
      {
        "quantity": 1,
        "item": "Veículo de transporte"
      },
      {
        "quantity": 2,
        "item": "Voluntário"
      }
    ]
  }
]
```

<br/>
<br/>

<h2> Buscar centro comunitário pelo id </h2>

`GET /communitycenter/:id - FORMATO DA REQUISIÇÃO`

Essa requisição irá retornar o centros comunitário informado pelo Id.

<br/>

```json
{
  "_id": "66ad6c5682b9e799fe9d1507",
  "name": "Teste Center 1",
  "address": "example",
  "localization": "example",
  "maxNumberPeople": 20,
  "quantityPeopleOccupation": 18,
  "resource": [
    {
      "item": "Kit de suprimentos médicos",
      "quantity": 99
    },
    {
      "item": "Médico",
      "quantity": 99
    },
    {
      "quantity": 1,
      "item": "Veículo de transporte"
    },
    {
      "quantity": 2,
      "item": "Voluntário"
    }
  ]
}
```

<br/>
<br/>

<h2 align ='left'> Criação de centro comunitário </h2>

`POST /communitycenter - FORMATO DA REQUISIÇÃO`

<p>A propriedade <strong>resource</strong> representa os recursos disponíveis no centro, sendo necessário informar o id dos recursos que o centro irá possui no momento da criação, bem como, a quantidade que o mesmo possui. A propriedade <strong>maxNumberPeople</strong> representa a quantidade máxima que o centro pode ocupar e a propriedade <strong>quantityPeopleOccupation</strong> representa a quantidade de pessoas presentes no centro.</p>

<br/>

```json
{
  "_id": "66ad6c5682b9e799fe9d1507",
  "name": "Teste Center 1",
  "address": "example",
  "localization": "example",
  "maxNumberPeople": 20,
  "quantityPeopleOccupation": 18,
  "resource": [
    {
      "item": "Kit de suprimentos médicos",
      "quantity": 99
    },
    {
      "item": "Médico",
      "quantity": 99
    },
    {
      "quantity": 1,
      "item": "Veículo de transporte"
    },
    {
      "quantity": 2,
      "item": "Voluntário"
    }
  ]
}
```

<br>
<br>

<h2> Removendo centro comunitário </h2>

`DEL /communitycenter/:id - FORMATO DA REQUISIÇÃO`

<p>Para remover o centro é necessário passar o id do centro na request como query params</p>
<br/>
<br/>

<h2 align ='left'> Atualizando centro comunitário </h2>

`PUT /communitycenter/:id - FORMATO DA REQUISIÇÃO`

<p>Esse endpoint servirá para quaisquer atualização em propriedades básicas do centro comunitário como name, address, localization e maxNumberPeople,mas não permitirá a atualização de propriedade como <strong>quantityPeopleOccupation</strong> e <strong>resource</strong>, pois somente podem ser atualizadas em seus respectivos serviços: alterar quantidade de pessoas no centro e intercâmbio, respectivamente.</p>
<br/>

```json
{
  "name": "Center marvel",
  "address": "example asd ",
  "localization": "example asdasd",
  "maxNumberPeople": 100
}
```

<br/>
<br/>

<h2 align ='left'> Atualizando a quantidade de pessoas no centro </h2>

`PUT /communitycenter/people/:id - `
` FORMATO DA REQUISIÇÃO`

<p>Para atualizar a quantidade de pessoas em um centro comunitário, poder-se-á utilizar este endpoint informando a quantidade atual de pessoas</p>

<br/>

```json
{
  "quantityPeopleOccupation": 10
}
```

<br/>
<br/>

## **Endpoint - Intercâmbio**

<hr/>

<br/>

<h2 align = "left"> Realizando Intercâmbio </h2>

`POST /exchange - FORMATO DA REQUISIÇÃO`

<p>Esse endpoint é responvável por realizar o intercâmbio entre dois centros comunitários, onde itens do centro um vão para o centro dois e vice versa. Eles poderam realizar o intercâmbio se, e somente se, a soma dos pontos do itens de um centro for igual ao do outro centro. Por exemplo, 2 voluntários e 1 veículo de transporte (2 x 3 + 1 x 5 = 11), valem o mesmo que 1 médico e 1 kit de suprimentos médicos (1 x 4 + 1 x 7 = 11). Esta regra poderá ser quebrada caso algum centro esteja com ocupação maior que 90%, onde ele poderá oferecer menos recursos que outro centro no intercâmbio. Ao final os itens são transferidos (são decrescidos do centro de origem e somados ao centro de destino) para os centros contabilizando em suas respectivas contagens de recursos.</p>

Significados das propriedades abaixo:

<ul>
    <li><strong>communityCenterOne</strong> - Id do centro comunitário número 1</li>
    <li><strong>communityCenterOne</strong> - Id do centro comunitário número 2</li>
    <li><strong>resourceCCOne</strong> - recursos que o centro comunitário 1 está disposto a intercambiar </li>
    <li><strong>resourceCCTwo</strong> - recursos que o centro comunitário 2 está disposto a intercambiar </li>
    <li><strong>quantity</strong> - quantidade de recursos dispostos para o intercâmbio</li>
    <li><strong>item</strong> - nome do recurso</li>
</ul>

```json
{
  "communityCenterOne": "66ad6c5682b9e799fe9d1507",
  "communityCenterTwo": "66ad6c8682b9e799fe9d150a",
  "resourceCCOne": [
    {
      "quantity": 1,
      "item": "Médico"
    },
    {
      "quantity": 1,
      "item": "Kit de suprimentos médicos"
    }
  ],
  "resourceCCTwo": [
    {
      "quantity": 1,
      "item": "Veículo de transporte"
    },
    {
      "quantity": 2,
      "item": "Voluntário"
    }
  ]
}
```

<br/>
<br/>

<h2 align = "left"> Removendo item do histórico de intercâmbio </h2>

`DELETE /exchange/:id - FORMATO DA REQUISIÇÃO`

<p>Esse endpoint recebe o id do item de histórico e o remove.</p>

<br/>
<br/>

## **Endpoint - Relatórios**

<hr/>
<br/>

<h2 align = "left"> Listar centros comunitários com ocupação maior que 90%</h2>

`GET /reportstuffed - FORMATO DA REQUISIÇÃO`

<p>Esse endpoint tem como finalidade listar todos os centros comunitários com ocupação de pessoas maior que 90% de sua capacidade máxima. Perceba a propriedade 
<strong>maxNumberPeople</strong> determina a quantidade máxima de pessoas que um centro suporta e a propriedade <strong>quantityPeopleOccupation</strong> define quando um centro está com ocupação maior que 90%.</p>

<br/>

```json
[
  {
    "_id": "66ad6c5682b9e799fe9d1507",
    "name": "Teste Center 1",
    "address": "example",
    "localization": "example",
    "maxNumberPeople": 20,
    "quantityPeopleOccupation": 18,
    "resource": [
      {
        "item": "Kit de suprimentos médicos",
        "quantity": 99
      },
      {
        "item": "Médico",
        "quantity": 99
      },
      {
        "quantity": 1,
        "item": "Veículo de transporte"
      },
      {
        "quantity": 2,
        "item": "Voluntário"
      }
    ]
  }
]
```

<br/>
<br/>

`GET /reportaverage - FORMATO DA REQUISIÇÃO`

<p>Esse endpoint tem como finalidade calcular a quantidade média dos itens que os centros possuem. Caso algum item, não esteja em nenhum centro, ele não entrará no cálculo.</p>

<br/>

```json
{
  "message": "6 Voluntário, 3 Médico, 3 Kit de suprimentos médicos, 6 Veículo de transporte, per center."
}
```

<br/>
<br/>

<h2 align = "left"> Listar histórico de Intercâmbio </h2>

`GET /reporthistoric/:id?date=yyyy-mm-dd hh:MM:ss - FORMATO DA REQUISIÇÃO`

<p>Esse endpoint tem como finalidade listar apenas os intercâmbios realizados por um determinado centro comunitário e por um datetime do passado até o presente momento.</p>

Significados das query params acima na request:

<ul>
    <li><strong>yyyy</strong> - ano</li>
    <li><strong>mm</strong> - mês</li>
    <li><strong>dd</strong> - dia </li>
    <li><strong>hh</strong> - horas </li>
    <li><strong>MM</strong> - minutos</li>
    <li><strong>ss</strong> - segundos</li>
</ul>

Significados das propriedades da resposta:

<ul>
    <li><strong>communityCenterOne</strong> - centro um que realizou o intercâmbio</li>
    <li><strong>communityCenterTwo</strong> - centro dois que realizou o intercâmbio</li>
    <li><strong>dateExchange</strong> - momento da realização do intercâmbio </li>
    <li><strong>resourceExchangeCenterOne</strong> - lista de recursos cedidos pelo centro um </li>
    <li><strong>resourceExchangeCenterTwo</strong> - lista de recursos cedidos pelo centro dois</li>
    <li><strong>quantity</strong> - quantidade de itens cedidos</li>
    <li><strong>item</strong> - nome do item cedido</li>
</ul>

<br/>

```json
[
  {
    "_id": "66ad757b92f76360ef86d82d",
    "communityCenterOne": "66ad6c5682b9e799fe9d1507",
    "communityCenterTwo": "66ad6c8682b9e799fe9d150a",
    "dateExchange": "2024-08-02T21:08:33-03:00",
    "resourceExchangeCenterOne": [
      {
        "quantity": 1,
        "item": "Médico",
        "_id": "66ad757b92f76360ef86d82e"
      },
      {
        "quantity": 1,
        "item": "Kit de suprimentos médicos",
        "_id": "66ad757b92f76360ef86d82f"
      }
    ],
    "resourceExchangeCenterTwo": [
      {
        "quantity": 1,
        "item": "Veículo de transporte",
        "_id": "66ad757b92f76360ef86d830"
      },
      {
        "quantity": 2,
        "item": "Voluntário",
        "_id": "66ad757b92f76360ef86d831"
      }
    ]
  }
]
```

<br/>
<br/>

## **Endpoint - Recursos**

<hr/>
<br/>

<h2 align = "left"> Listar recursos</h2>

`GET /resource - FORMATO DA REQUISIÇÃO`

<p>Esse endpoint retorna todos os recursos que os centros podem utilizar em seus intercâmbios.</p>

<br/>

```json
[
  {
    "item": "Médico",
    "points": 4
  },
  {
    "item": "Voluntário",
    "points": 3
  },
  {
    "item": "Kit de suprimentos médicos",
    "points": 7
  },
  {
    "item": "Veículo de transporte",
    "points": 5
  },
  {
    "item": "Cesta básica",
    "points": 2
  }
]
```

<br/>
<br/>

Feito com ♥ by Vitor Soares Ferreira
