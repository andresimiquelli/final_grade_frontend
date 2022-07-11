import React, { useState } from 'react';
import DefaultTable from '../../components/DefaultTable';
import FrameModal from '../../components/FrameModal';
import packType from '../../services/apiTypes/Pack';

interface PackFrameProps {
    show?: boolean;
    handleSelect?(pack: packType): void;
    handleClose?(): void;
}

const PackFrame: React.FC<PackFrameProps> = ({ show, handleSelect, handleClose }) => {

    const[packs,setPacks] = useState<packType[]>([])

    function handleResult(nPacks: packType[]) {
        setPacks(nPacks)
    }

    function showTable() {
        return (
            <DefaultTable selectionMode>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Curso</th>
                    </tr>
                </thead>
                <tbody>
                {
                    packs.map(pack => 
                        <tr key={pack.id}
                            onClick={() => handleSelect&& handleSelect(pack)}>
                            <td>{pack.name}</td>
                            <td>{pack.course?.name}</td>
                        </tr>
                    )
                }
                </tbody>
            </DefaultTable>
        )
    }

    return (
        <FrameModal<packType>
            show={show}
            endpoint='packs'
            searchField='name'
            searchOperator='like'
            searchPlaceholder='Buscar pacote didático'
            handleShowResult={handleResult}
            handleClose={handleClose}
            title='Selecionar pacote didático'>
            { showTable() }
        </FrameModal>
    );
}

export default PackFrame;