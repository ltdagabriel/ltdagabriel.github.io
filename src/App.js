import React from 'react';
// eslint-disable-next-line no-unused-vars
import logo from './logo.svg';
import './App.css';
// eslint-disable-next-line no-unused-vars
import {Alert, Button, Card, Col, Container, Image, Jumbotron, ListGroup, Row, Table} from "react-bootstrap";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

import vando from "./img/vando.jpg"

function App() {
    return (
        <div className="App">
            <header className="App-header">

                <Router>
                    <Switch>
                        <Route path="/vanderson">
                            <CurriculumVando/>
                        </Route>
                        <Route path="/gabriel">
                            <CurriculumGabriel/>
                        </Route>
                        <Route path="/">
                            <Home/>
                        </Route>
                    </Switch>
                </Router>

            </header>
        </div>
    );
}

function Home() {
    return <Container>
        <Row>
            <Col>
                <Alert variant={"dark"}>
                    <h1>Vanderson Choptian</h1>
                    <p>
                        Estudou Bacharelado em Engenharia Civil na instituição de ensino Faculdade de Engenharia
                        e Inovação Técnico Profissional e Agronegócio na instituição de ensino Faculdades do Centro do
                        Paraná,
                        atualmente trabalha como...
                    </p>
                    <p>
                        <Button variant="outline-success" href={"/vanderson"}>Visualizar currículo</Button>
                    </p>
                </Alert>

                <Alert variant={"dark"}>
                    <h1>Gabriel Choptian</h1>
                    <p>
                        Estudou Bacharelado em Ciências da Computação na instituição de ensino Universidade Tecnológica
                        Federal do paraná ...
                    </p>
                    <p>
                        <Button variant="outline-success" href={"/gabriel"}>Visualizar currículo</Button>
                    </p>
                </Alert>

            </Col>
        </Row>
    </Container>
}

function CurriculumVando() {
    return <Container>
        <div style={{background: "rgb(252,252,240)", borderRadius: "1em", borderColor: "dark"}}>
            <Container>
                <Row>
                    <Col>
                        <Table size="sm" responsive>
                            <thead>
                            <tr>
                                <td colSpan={2}><strong className="mr-auto">Cartão de visita</strong></td>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td colSpan={1}>
                                    <Table>
                                        <Image src={vando} rounded fluid/>
                                    </Table>
                                </td>
                                <td colSpan={2}>
                                    <Table bordered hover size="sm" responsive>
                                        <thead style={{textAlign: "center"}}>
                                        <tr>
                                            <td colSpan={2}><strong className="mr-auto">Vanderson Choptian</strong></td>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {[
                                            {title: "E-mail", data: "vanderson_choptian@hotmail.com"},
                                            {title: "Site", data: "www.choptian.com.br"},
                                            {title: "Telefone", data: "+55 (44) 99769-6806"}
                                        ].map(item => {
                                            return <tr>
                                                <td>{item.title}</td>
                                                <td>{item.data}</td>
                                            </tr>
                                        })}
                                        </tbody>
                                    </Table>
                                </td>
                            </tr>
                            </tbody>

                        </Table>
                    </Col>

                </Row>
            </Container>
            <Container>
                <Row>
                    <Col>
                        <Table size="sm" responsive>
                            <thead>
                            <tr>
                                <td colSpan={2}><strong className="mr-auto">Resumo de Qualificações</strong></td>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>Carreira desenvolvida na área de Engenharia Civil, com experiência no
                                    acompanhamento,
                                    planejamento e controle de obras, elaboração de cronograma físico-financeiro e
                                    desenvolvimento de
                                    indicadores de desempenho, agindo de acordo com os custos e prazos estabelecidos
                                    pela
                                    organização.
                                </td>
                            </tr>
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
            <Container>
                <Row>
                    <Col>
                        <Table size="sm">
                            <thead>
                            <tr>
                                <td colSpan={2}><strong className="mr-auto">Formação Acadêmica</strong></td>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                [
                                    {
                                        level: "Pós-Graduação",
                                        course: "Segurança do Trabalho",
                                        institution: "Faculdade de Engenharia e Inovação Técnico Profissional",
                                        institutionInitials: "FEITEP",
                                        finished: "2020"
                                    },
                                    {
                                        level: "Graduação",
                                        course: "Engenharia Civil",
                                        institution: "Faculdade de Engenharia e Inovação Técnico Profissional",
                                        institutionInitials: "FEITEP",
                                        finished: "2018"
                                    },
                                    {
                                        level: "Graduação",
                                        course: "Tecnologia em Agronegócios",
                                        institution: "Faculdade do Centro do Paraná",
                                        institutionInitials: "UCP",
                                        finished: "2010"
                                    },
                                    {
                                        level: "Colégio",
                                        course: "Ensino Médio",
                                        institution: "Colégio Estadual General Carneiro E.F.M.P",
                                        finished: "2006"
                                    }
                                ].map(item => {
                                    return <tr>

                                        <td colSpan="2">
                                            <Row>
                                                <Col md={3}>
                                                    <div style={{
                                                        color: "teal",
                                                        fontSize: "2em",
                                                        fontFamily: "Helvetica"
                                                    }}>
                                                        {item.finished}
                                                    </div>
                                                </Col>
                                                <Col>
                                                    <div>
                                                        {item.level} em {item.course} na
                                                        instituição {item.institution} {(item.institutionInitials ? ("(" + item.institutionInitials + ")") : "")}
                                                    </div>
                                                </Col>
                                            </Row>
                                        </td>
                                    </tr>
                                })
                            }
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>

            <Container>
                <Row>
                    <Col>
                        <Table size="sm">
                            <thead>
                            <tr>
                                <td colSpan={2}><strong className="mr-auto">Experiência Profissional</strong></td>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                [
                                    {
                                        job: "Pintor",
                                        company: "Maxx Paint - Pinturas e Reformas",
                                        constructions: [{
                                            company: "Edifício Le Monde",
                                            job: "Pintura do Estacionamento e Heliporto"
                                        }, {
                                            company: "Terraço Silva Jardim",
                                            job: "Pintura doEstacionamento"
                                        }, {
                                            company: "Edifício dom Casmurro",
                                            job: "Pintura do Estacionamento"
                                        }, {
                                            company: "Edifício Veleiros",
                                            job: "Pintura do Estacionamento"
                                        }, {
                                            company: "Colégio Estadual José Guimarães",
                                            job: "Pintura da Quadra poliesportiva"
                                        }],
                                        time: "2018 - 2020"
                                    },
                                    {
                                        job: "Sócio",
                                        company: "Microempresa Choptian e Razzini-ME",
                                        constructions: [{
                                            company: "Engenhosul",
                                            job: "Pintura parcial do Supermercado BIG (Chapecó-SC)"
                                        }, {
                                            company: "Engenhosul",
                                            job: "Pintura parcial do Leroy Merlin (São Leopoldo-RS)"
                                        }, {
                                            company: "Piacentini",
                                            job: "Pintura parcial do Milton de Paula Walter (Campo Mourão-PR)"
                                        }],
                                        time: "2012 - 2013"
                                    },
                                    {
                                        job: "Pintor",
                                        company: "Trabalho Autônomo",
                                        constructions: [{
                                            company: "Piacentini",
                                            job: "Pintura parcial do Condomínio Dona Lurdes (Campo Mourão-PR)"
                                        }, {
                                            company: "Portinari",
                                            job: "Pintura parcial do Supermercado Mercadorama (Maringá-PR)"
                                        }, {
                                            company: "Engenhosul",
                                            job: "Pintura de 23 casa populares em condominio fechado (Fazenda Rio Grande-PR)"
                                        }, {
                                            company: "Cohapar",
                                            job: "Pintura de 76 casas populares (Juranda-PR)"
                                        }, {
                                            company: "Cohapar",
                                            job: "Pintura de 38 casas populares (Janiopolis-PR)"
                                        }, {
                                            company: "Piacentini",
                                            job: "Pintura parcial do Conjunto Avelino Piacentini (Campo Mourão-PR)"
                                        }],
                                        time: "2012 - 2013"
                                    },
                                    {
                                        job: "Serviços Gerais",
                                        company: "Agro Industrial Parati ltda",
                                        activities: "Controle de mortalidade de aves, Controle de pesagem, Controle de temperatura do aviário, Controle de alimentação, Controle de vacinação, Emissão de GTA e Despacho de ovos férteis",
                                        time: "2012 - 2013"
                                    },
                                    {
                                        job: "Operador de máquinas agrícolas",
                                        company: "Aprendizagem com experiência",
                                        activities: "Operação de Trator, Pá carregadeira e plataforma elevatória"
                                    },
                                    {
                                        job: "Hardwares e Softwares",
                                        company: "Cursos basicos",
                                        activities: "Manutenção de hardware de computadores, curso de informática básica, curso basico de uso de software microsoft office excel, curso de AUTOCAD"
                                    },
                                    {
                                        job: "Pessoal",
                                        company: "Auto Análise",
                                        activities: "Facilidade em aprendizado, alta adaptabilidade, proatividade e bom relacionamento"
                                    }
                                ].map(item => {
                                    return <tr>

                                        <td colSpan="2">
                                            <Row>
                                                <Col>
                                                    <h2>{item.company}</h2>
                                                    <h4>
                                                        Cargo: {item.job} {(item.time) ? "entre " + item.time : ""}
                                                    </h4>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <div>
                                                        <hr/>
                                                        {(item.constructions) ? (item.constructions.map(jobs => {
                                                                return <div>
                                                                    <h3>Empresa: {jobs.company} </h3>
                                                                    <h5>Trabalho: {jobs.job} </h5>
                                                                </div>

                                                            })) :
                                                            <none> Atividades: {item.activities}</none>}
                                                    </div>
                                                </Col>
                                            </Row>
                                        </td>
                                    </tr>
                                })
                            }
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>

        </div>
    </Container>
}

function CurriculumGabriel() {
    return <Container>

    </Container>
}


export default App;
