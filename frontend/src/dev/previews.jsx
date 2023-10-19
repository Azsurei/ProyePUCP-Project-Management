import React from 'react'
import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox-next'
import {PaletteTree} from './palette'
import EDTNew from "@/app/dashboard/[project]/EDT/EDTNew/page";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/EDTNew">
                <EDTNew/>
            </ComponentPreview>
        </Previews>
    )
}

export default ComponentPreviews