import React, { useEffect, useState } from 'react';
import { Container, Col, Row, Button } from 'react-bootstrap';
import { useNav, MenuKeys } from '../../context/nav';
import UserFrame from '../../frames/UserFrame';

const Dashboard: React.FC = () => {

    const { setSelectedMenu } = useNav()

    const[showUserFrame,setShowUserFrame] = useState(false)

    useEffect(() => {
        setSelectedMenu(MenuKeys.DASHBOARD)
    },[])

    return (
        <Container>
            <Row>
                <Col>
                    <UserFrame show={showUserFrame} handleClose={() => setShowUserFrame(false)}/>
                    <Button onClick={() => setShowUserFrame(true)}>Show user frame</Button>
                </Col>
            </Row>
        </Container>
    );
}

export default Dashboard;