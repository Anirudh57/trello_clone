"use client";

import React, { useEffect, useState } from 'react'
import { CardModel } from '../models/card-model';
import { ProModal } from '../models/pro-modal';


const ModelProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);
    
    if (!isMounted) {
        return null;
    }

  return (
    <>
        <CardModel />
        <ProModal />
    </>
  )
}

export default ModelProvider



