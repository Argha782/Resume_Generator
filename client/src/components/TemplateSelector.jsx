import { Check, Layout } from 'lucide-react';
import React, { useState } from 'react'

function TemplateSelector({selectedTemplate, onChange}) {
    const[isOpen,setIsOpen]=useState(false);
    const templates=[
        {id:'classic', name:'Classic', preview:'A clean, traditonal resume format with clear sections and easy readability.'},
        {id:'modern', name:'Modern', preview:'A contemporary resume design with stylish elements and a fresh layout.'},
        {id:'minimal', name:'Minimal', preview:'A simple, elegant resume style focusing on content with minimal distractions.'},
        {id:'minimal-image', name:'Minimal with Image', preview:'A sleek resume format that includes a profile image alongside essential information.'},
    ];
    return (
        <div className='relative'>
            <button className='flex items-center gap-1 text-sm text-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 ring-blue-300 hover:ring transition-all px-3 py-2 rounded-lg' onClick={()=>setIsOpen(!isOpen)}>
                <Layout size={14}/><span className='max-sm:hidden'>Template</span>
            </button>
            {isOpen && (
                <div className='absolute to-full w-xs p-3 mt-2 space-y-3 z-10 bg-white rounded-md border border-gray-200 shadow-sm'>
                    {templates.map((template)=>(
                        <div key={template.id} onClick={()=>{
                            onChange(template.id);setIsOpen(false)}} className={`relative p-3 rounded-md mb-2 cursor-pointer transition-all  ${selectedTemplate===template.id ? 'border-blue-400 bg-blue-100':'border-gray-300 hover:bg-gray-100'}`}>
                            {selectedTemplate===template.id && (
                                <div className='aboslute top-2 right-2'> 
                                    <div className='size-5 bg-blue-400 rounded-full flex items-center justify-center'>
                                        <Check className='w-3 h-3 text-white'/>
                                    </div>
                                </div>
                            )}
                            <div className='space-y-1'>
                                <h4 className='font-medium text-gray-800'>{template.name}</h4>
                                <div className='mt-2 p-2 bg-blue-50 rounded text-xs text-gray-500 italic'>{template.preview}</div>
                            </div>
                        </div>
                    ))} 
                </div>
            )}
        </div>
    )
}

export default TemplateSelector
