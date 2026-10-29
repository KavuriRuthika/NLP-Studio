# Academic and Technical References

This document provides complete, verified bibliographic references for the research foundations, open-source libraries, benchmarks, and ethical frameworks utilized throughout this natural language processing project.

---

## 1. Foundational Transformer & Language Model Papers

1. **Attention Is All You Need**
   - **Authors:** Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Łukasz Kaiser, Illia Polosukhin
   - **Year:** 2017
   - **Venue:** Advances in Neural Information Processing Systems (NeurIPS 2017), Vol. 30, pp. 5998–6008.
   - **URL:** [https://arxiv.org/abs/1706.03762](https://arxiv.org/abs/1706.03762)
   - **Relevance:** Introduced the multi-head self-attention mechanism that replaces recurrence and convolutions, forming the architectural backbone of BERT, DistilBERT, and all modern transformer models.

2. **BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding**
   - **Authors:** Jacob Devlin, Ming-Wei Chang, Kenton Lee, Kristina Toutanova
   - **Year:** 2018 (Published in NAACL-HLT 2019)
   - **Venue:** Proceedings of the 2019 Conference of the North American Chapter of the Association for Computational Linguistics: Human Language Technologies, Vol. 1, pp. 4171–4186.
   - **URL:** [https://arxiv.org/abs/1810.04805](https://arxiv.org/abs/1810.04805)
   - **Relevance:** Introduced bidirectional transformer pre-training using Masked Language Modeling (MLM) and Next Sentence Prediction (NSP), establishing state-of-the-art transfer learning for text classification.

3. **DistilBERT, a distilled version of BERT: smaller, faster, cheaper and lighter**
   - **Authors:** Victor Sanh, Lysandre Debut, Julien Chaumond, Thomas Wolf
   - **Year:** 2019
   - **Venue:** NeurIPS 2019 Workshop on Energy Efficient Machine Learning and Cognitive Computing.
   - **URL:** [https://arxiv.org/abs/1910.01108](https://arxiv.org/abs/1910.01108)
   - **Relevance:** The primary baseline model of this project. Demonstrates knowledge distillation reducing BERT's parameter count by 40% while retaining 97% of language understanding capabilities and running 60% faster.

4. **RoBERTa: A Robustly Optimized BERT Pretraining Approach**
   - **Authors:** Yinhan Liu, Myle Ott, Naman Goyal, Jingfei Du, Mandar Joshi, Danqi Chen, Omer Levy, Mike Lewis, Luke Zettlemoyer, Veselin Stoyanov
   - **Year:** 2019
   - **Venue:** arXiv preprint arXiv:1907.11692.
   - **URL:** [https://arxiv.org/abs/1907.11692](https://arxiv.org/abs/1907.11692)
   - **Relevance:** Serves as the comparison architecture; shows the benefits of dynamic masking, larger mini-batches, removing next sentence prediction, and longer pretraining on diverse corpora.

---

## 2. Software Frameworks and Libraries

5. **Hugging Face Transformers: State-of-the-Art Natural Language Processing**
   - **Authors:** Thomas Wolf, Lysandre Debut, Victor Sanh, Julien Chaumond, Clement Delangue, Anthony Moi, Pierric Cistac, Clara Ma, Yacine Jernite, Julien Plu, Canwen Xu, Teven Le Scao, Sylvain Gugger, Mariama Drame, Quentin Lhoest, Alexander M. Rush
   - **Year:** 2020
   - **Venue:** Proceedings of the 2020 Conference on Empirical Methods in Natural Language Processing: System Demonstrations, pp. 38–45.
   - **Documentation URL:** [https://huggingface.co/docs/transformers/index](https://huggingface.co/docs/transformers/index)
   - **Repository:** [https://github.com/huggingface/transformers](https://github.com/huggingface/transformers)
   - **Relevance:** Provides the core Python implementation for tokenizers, model pipelines, and weight management.

6. **Scikit-learn: Machine Learning in Python**
   - **Authors:** Fabian Pedregosa, Gaël Varoquaux, Alexandre Gramfort, Vincent Michel, Bertrand Thirion, Olivier Grisel, Mathieu Blondel, Peter Prettenhofer, Ron Weiss, Vincent Dubourg, Jake Vanderplas, Alexandre Passos, David Cournapeau, Matthieu Brucher, Matthieu Perrot, Édouard Duchesnay
   - **Year:** 2011
   - **Venue:** Journal of Machine Learning Research (JMLR), Vol. 12, pp. 2825–2830.
   - **Documentation URL:** [https://scikit-learn.org/stable/modules/model_evaluation.html](https://scikit-learn.org/stable/modules/model_evaluation.html)
   - **Relevance:** Provides rigorous, reproducible implementations for accuracy, precision, recall, F1-score, and confusion matrix computation.

7. **LangChain: Building applications with LLMs through composability**
   - **Authors:** Harrison Chase et al.
   - **Year:** 2022–2024
   - **Official Documentation:** [https://python.langchain.com/docs/introduction/](https://python.langchain.com/docs/introduction/)
   - **Repository:** [https://github.com/langchain-ai/langchain](https://github.com/langchain-ai/langchain)
   - **Relevance:** Demonstrates modular orchestration connecting the NLP application layer, prompt formatting, and Hugging Face transformer inference pipelines.

---

## 3. Benchmarks and Datasets

8. **Learning Word Vectors for Sentiment Analysis (IMDb Dataset)**
   - **Authors:** Andrew L. Maas, Raymond E. Daly, Peter T. Pham, Dan Huang, Andrew Y. Ng, Christopher Potts
   - **Year:** 2011
   - **Venue:** Proceedings of the 49th Annual Meeting of the Association for Computational Linguistics: Human Language Technologies (ACL 2011), pp. 142–150.
   - **URL:** [https://ai.stanford.edu/~amaas/data/sentiment/](https://ai.stanford.edu/~amaas/data/sentiment/)
   - **Relevance:** Classic benchmark dataset of 50,000 highly polar movie reviews for binary sentiment classification.

9. **Recursive Deep Models for Semantic Compositionality Over a Sentiment Treebank (SST-2)**
   - **Authors:** Richard Socher, Alex Perelygin, Jean Y. Wu, Jason Chuang, Christopher D. Manning, Andrew Y. Ng, Christopher Potts
   - **Year:** 2013
   - **Venue:** Proceedings of the 2013 Conference on Empirical Methods in Natural Language Processing (EMNLP 2013), pp. 1631–1642.
   - **URL:** [https://nlp.stanford.edu/sentiment/](https://nlp.stanford.edu/sentiment/)
   - **Relevance:** The fine-tuning target benchmark for `distilbert-base-uncased-finetuned-sst-2-english`.

---

## 4. Responsible AI, Ethics, and Governance

10. **On the Dangers of Stochastic Parrots: Can Language Models Be Too Big? 🦜**
    - **Authors:** Emily M. Bender, Timnit Gebru, Angelina McMillan-Major, Shmargaret Shmitchell
    - **Year:** 2021
    - **Venue:** Proceedings of the 2021 ACM FAccT Conference, pp. 610–623.
    - **URL:** [https://doi.org/10.1145/3442188.3445922](https://doi.org/10.1145/3442188.3445922)
    - **Relevance:** Foundational analysis of environmental costs, training data biases, lack of true semantic comprehension, and systemic risks of large language models.

11. **Datasheets for Datasets**
    - **Authors:** Timnit Gebru, Jamie Morgenstern, Briana Vecchione, Jennifer Wortman Vaughan, Hanna Wallach, Hal Daumé III, Kate Crawford
    - **Year:** 2021
    - **Venue:** Communications of the ACM, Vol. 64, No. 12, pp. 86–92.
    - **URL:** [https://doi.org/10.1145/3458723](https://doi.org/10.1145/3458723)
    - **Relevance:** Standardizes documentation of training corpora, data collection provenance, consent, and demographic limitations.

12. **Model Cards for Model Reporting**
    - **Authors:** Margaret Mitchell, Simone Wu, Andrew Zaldivar, Parker Barnes, Lucy Vasserman, Ben Hutchinson, Elena Spitzer, Ian D. Raji, Timnit Gebru
    - **Year:** 2019
    - **Venue:** Proceedings of the Conference on Fairness, Accountability, and Transparency (FAT* '19), pp. 220–229.
    - **URL:** [https://doi.org/10.1145/3287560.3287596](https://doi.org/10.1145/3287560.3287596)
    - **Relevance:** Framework for reporting intended use cases, performance across subpopulations, evaluation procedures, and ethical limitations for machine learning models.
