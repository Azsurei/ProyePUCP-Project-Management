import React from 'react';
import styled from '@emotion/styled';

const Card = styled.div`
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    max-width: 500px;
    margin: 10px auto;
    padding: 20px;

    @media (max-width: 768px) {
        max-width: 100%;
        padding: 10px;
    }
`;

const Title = styled.h2`
    font-size: 1.5em;
    margin-bottom: 20px;

    @media (max-width: 768px) {
        font-size: 1.2em;
    }
`;

const InnerContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 20px;

    // You can add more responsive styles here if needed.
`;

const CardComplex = ({ title, children }) => {
    return (
        <Card>
            <Title>{title}</Title>
            <InnerContainer>
                {children}
            </InnerContainer>
        </Card>
    );
};

export default CardComplex;
