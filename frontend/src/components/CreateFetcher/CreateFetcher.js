import React, { useState, useEffect } from 'react'

import styles from './CreateFetcher.module.css';

export default function CreateFetcher(props) {
    const {
        onClose
    } = props

    return (
        <div id="myModal" className={styles.modal}>
            <div class="modal-content">
                <div className={styles.closeButton} onClick={onClose}>&times;</div>
                {/* <div>Create a Discord Server Fetcher</div>
                <div>1. Connect to your discord account</div>
                <div>Discord API</div>
                <div>2. Choose discord fetcher that you wish to create</div>
                <div class="dropdowns">
                    <label for="dropdown1">Dropdown 1:</label>
                    <select id="dropdown1">
                        <option value="option1">Option 1</option>
                        <option value="option2">Option 2</option>
                        <option value="option3">Option 3</option>
                    </select>
                </div>
                <div>3. Define the membership tiers</div>
                <div>name</div>
                <button>Create</button> */}
                <div className={styles.step}>
                    <div>
                        <div className={styles.circle}>1</div>
                    </div>
                    <div>
                        <div class="title">Connect to your discord account</div>
                        <div class="caption">Discord API</div>
                    </div>
                </div>
                <div className={styles.step}>
                    <div>
                        <div className={styles.circle}>2</div>
                    </div>
                    <div>
                        <div class="title">Choose discord fetcher that you wish to create</div>
                        <div class="caption">Channel 1   Channel 2</div>
                    </div>
                </div>
                <div className={styles.step}>
                    <div>
                        <div className={styles.circle}>3</div>
                    </div>
                    <div>
                        <div class="title">Define the membership tiers</div>
                        <div class="caption">Some text about Third step. </div>
                        <div class="caption">Some text about Third step. </div>
                        <div class="caption">Some text about Third step. </div>
                        <div class="caption">Some text about Third step. </div>
                        <div class="caption">Some text about Third step. </div>

                    </div>
                </div>
                <div >
                    <button className={styles.createButton}>Create</button>
                </div>
            </div>
        </div>
    );
}
