import {makeProject} from '@motion-canvas/core';

import MainTitleCard from './scenes/MainTitleCard?scene';
import TextureSlotsDemo from './scenes/TextureSlotsDemo?scene';
import SparseTexturesCard from './scenes/SparseTexturesCard?scene';
import SparseTextures from './scenes/SparseTextures?scene';
import TextureArraysCard from './scenes/TextureArraysCard?scene';
import TextureArrays from './scenes/TextureArrays?scene';
import SparseTextureArrays from './scenes/SparseTextureArrays?scene';
import BindlessTexturesCard from './scenes/BindlessTexturesCard?scene';
import BindlessTextures from './scenes/BindlessTextures?scene';
import SayingSBTAs from './scenes/SayingSBTAs?scene';
import TextureCompressionCard from './scenes/TextureCompressionCard?scene';
import TextureCompression from './scenes/TextureCompression?scene';
import VertexOptimizationCard from './scenes/VertexOptimizationCard?scene';
import VertexOptimization from './scenes/VertexOptimization?scene';
import Disclaimer from './scenes/Disclaimer?scene';

export default makeProject({
  scenes: [
    MainTitleCard,
    TextureSlotsDemo,
    SparseTexturesCard,
    SparseTextures,
    TextureArraysCard,
    TextureArrays,
    SparseTextureArrays,
    BindlessTexturesCard,
    BindlessTextures,
    SayingSBTAs,
    TextureCompressionCard,
    TextureCompression,
    VertexOptimizationCard,
    VertexOptimization,
    Disclaimer
  ],
});
