import React, { useEffect, useState } from 'react';
import { Container, Col, Row, Button } from 'react-bootstrap';
import { useNav, MenuKeys } from '../../context/nav';

const Dashboard: React.FC = () => {

    const { setSelectedMenu, setContentTitle } = useNav()

    useEffect(() => {
        setSelectedMenu(MenuKeys.DASHBOARD)
        setContentTitle('Dashboard')
    },[])

    return (
        <Container>
            <Row>
                <Col>

                </Col>
            </Row>
        </Container>
    );
}

export default Dashboard;