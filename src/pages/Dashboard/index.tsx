import React, { useEffect } from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import { useNav, MenuKeys } from '../../context/nav';
import UserFrame from '../../frames/UserFrame';

const Dashboard: React.FC = () => {

    const { setSelectedMenu } = useNav()

    useEffect(() => {
        setSelectedMenu(MenuKeys.DASHBOARD)
    },[])

    return (
        <Container>
            <Row>
                <Col>
                    <UserFrame show={true} />
                    <h2>Dashboard</h2>
                </Col>
            </Row>
        </Container>
    );
}

export default Dashboard;